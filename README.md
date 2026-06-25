# The Tool Center AI Chatbot

Chatbot AI tư vấn sản phẩm, bảo hành và thu lead cho The Tool Center.

## Mục tiêu

- Tư vấn chọn máy, dụng cụ, pin, sạc theo nhu cầu thực tế.
- Tra cứu SKU và gợi ý sản phẩm thay thế.
- Trả lời nhanh thông tin showroom, giờ hoạt động, bảo hành.
- Thu lead khách hàng để chuyển cho đội sale.

## Công nghệ

- Next.js
- TypeScript
- Tailwind CSS
- OpenAI API
- Dữ liệu sản phẩm dạng JSON

## Cấu trúc

```txt
app/
  page.tsx
  layout.tsx
  api/chat/route.ts
components/
  ChatBox.tsx
  ChatInput.tsx
  Message.tsx
data/
  products.json
  faq.json
prompts/
  system-prompt.md
```

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Thêm `OPENAI_API_KEY` vào `.env.local` trước khi dùng API thật.

## Thông tin thương hiệu

THE TOOL CENTER – Uy tín – Chất lượng – Tận tâm – Nhanh chóng

Giờ hoạt động: 08:00–17:00
