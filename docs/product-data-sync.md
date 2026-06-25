# Product Data Sync

Tài liệu này mô tả cách chuẩn hóa file xuất WooCommerce và tự động cập nhật dữ liệu sản phẩm lên repository.

## Nguồn dữ liệu

- File đầu vào: CSV xuất từ WooCommerce.
- File đầu ra: `data/products.json`.
- Chatbot dùng `data/products.json` để tìm kiếm SKU, tên sản phẩm, danh mục, giá và mô tả.

## Cách chạy

```bash
npm install
npm run sync:products -- ./wc-product-export.csv
```

Lệnh trên sẽ tự động:

1. Đọc file CSV WooCommerce.
2. Chuẩn hóa dữ liệu sản phẩm.
3. Ghi vào `data/products.json`.
4. Commit thay đổi.
5. Push lên GitHub.

## Các trường được chuẩn hóa

```json
{
  "sku": "TRHLI202885",
  "name": "Tên sản phẩm",
  "brand": "TOTAL",
  "category": "Danh mục",
  "price": 0,
  "regularPrice": 0,
  "salePrice": null,
  "inStock": true,
  "stock": null,
  "tags": null,
  "image": "https://...",
  "summary": "Mô tả ngắn"
}
```

## Ghi chú

- Không commit file CSV gốc nếu không cần thiết.
- Khi xuất file mới từ WooCommerce, chỉ cần chạy lại lệnh `npm run sync:products -- <file.csv>`.
- Nếu dùng CI/CD sau này, có thể đưa bước sync này vào GitHub Actions hoặc cron job.
