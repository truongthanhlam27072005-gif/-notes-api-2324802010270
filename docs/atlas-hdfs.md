
# BÀI 3 – SO SÁNH MONGODB ATLAS VÀ HDFS

## 1. MongoDB Atlas – Replica Set 3 nút

```mermaid
flowchart TB
    A["Ứng dụng Notes API"]
    P["PRIMARY<br/>MongoDB Atlas"]
    S1["SECONDARY 1<br/>Bản sao dữ liệu"]
    S2["SECONDARY 2<br/>Bản sao dữ liệu"]

    A -->|"Ghi dữ liệu"| P
    P -->|"Replication"| S1
    P -->|"Replication"| S2
```

## 2. Hadoop HDFS – Replication Factor = 3

```mermaid
flowchart TB
    C["HDFS Client"]
    N["NameNode<br/>Quản lý metadata"]
    D1["DataNode 1<br/>Block A"]
    D2["DataNode 2<br/>Block A"]
    D3["DataNode 3<br/>Block A"]

    C -->|"Yêu cầu vị trí block"| N
    N -.->|"Metadata"| D1
    N -.->|"Metadata"| D2
    N -.->|"Metadata"| D3

    D1 -->|"Sao chép block"| D2
    D2 -->|"Sao chép block"| D3
```

## 3. So sánh

| Tiêu chí | MongoDB Atlas | Hadoop HDFS |
|---|---|---|
| Đơn vị nhân bản | Dữ liệu trong replica set | Block dữ liệu |
| Thành phần | Primary, Secondary | NameNode, DataNode |
| Mục tiêu | Sẵn sàng, chịu lỗi | Chịu lỗi, phân tán tệp |
| Số bản sao | 3 nút | 3 bản sao mỗi block |

## 4. Nhận xét

Cả hai đều dùng nhân bản để tăng khả năng
chịu lỗi và duy trì dữ liệu khi nút gặp sự cố.

MongoDB Atlas nhân bản dữ liệu giữa các
thành viên của replica set.

HDFS chia tệp thành các block và lưu
nhiều bản sao block trên các DataNode.
NameNode quản lý metadata thay vì lưu
trực tiếp các bản sao block.
