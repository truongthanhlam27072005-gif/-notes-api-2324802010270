
require('dotenv').config();

const mongoose = require('mongoose');
const Note = require('../src/models/note');

const pick = (r) =>
  (Array.isArray(r) ? r[0] : r).executionStats;

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Tạo và đồng bộ chỉ mục tags
    await Note.syncIndexes();

    // Truy vấn 1: Ép quét toàn bộ collection
    const scan = pick(
      await Note.find({ tags: 'docker' })
        .hint({ $natural: 1 })
        .explain('executionStats')
    );

    // Truy vấn 2: Dùng chỉ mục tags
    const idx = pick(
      await Note.find({ tags: 'docker' })
        .hint({ tags: 1 })
        .explain('executionStats')
    );

    console.table({
      'Quét toàn bộ': {
        docsExamined: scan.totalDocsExamined,
        returned: scan.nReturned,
        ms: scan.executionTimeMillis
      },
      'Dùng chỉ mục': {
        docsExamined: idx.totalDocsExamined,
        returned: idx.nReturned,
        ms: idx.executionTimeMillis
      }
    });

    if (idx.totalDocsExamined > 0) {
      const ratio =
        scan.totalDocsExamined / idx.totalDocsExamined;

      console.log(
        `Chỉ mục giảm khối lượng quét ${ratio.toFixed(2)} lần`
      );
    } else {
      console.log(
        'Chỉ mục không cần đọc tài liệu; xem executionStats.'
      );
    }

  } catch (err) {
    console.error('Lỗi explain:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
