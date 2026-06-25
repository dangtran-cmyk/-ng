'use client';

import { useState } from 'react';
import ChatInput from './ChatInput';
import Message, { ChatMessage } from './Message';

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Xin chào! Em là trợ lý AI của The Tool Center. Anh/chị cần tư vấn máy theo nhu cầu, tra cứu SKU hay hỏi về bảo hành?',
  },
];

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [loading, setLoading] = useState(false);

  async function handleSend(content: string) {
    const nextMessages = [...messages, { role: 'user' as const, content }];
    setMessages(nextMessages);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      });

      const data = await response.json();
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: data.reply || 'Hiện em chưa có đủ dữ liệu để trả lời câu này.',
        },
      ]);
    } catch {
      setMessages([
        ...nextMessages,
        {
          role: 'assistant',
          content: 'Có lỗi kết nối. Anh/chị thử lại sau hoặc liên hệ hotline The Tool Center.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200">
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
        <div>
          <h2 className="font-bold text-slate-900">TTC AI Chatbot</h2>
          <p className="text-xs text-slate-500">Tư vấn sản phẩm · Bảo hành · Thu lead</p>
        </div>
        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          Online
        </span>
      </div>

      <div className="flex h-[520px] flex-col gap-4 overflow-y-auto bg-slate-50 p-5">
        {messages.map((message, index) => (
          <Message key={`${message.role}-${index}`} message={message} />
        ))}
        {loading && <Message message={{ role: 'assistant', content: 'Đang kiểm tra dữ liệu sản phẩm...' }} />}
      </div>

      <ChatInput disabled={loading} onSend={handleSend} />
    </div>
  );
}
