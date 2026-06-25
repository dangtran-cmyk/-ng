import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'The Tool Center AI Chatbot',
  description: 'AI tư vấn sản phẩm và dịch vụ cho The Tool Center',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
