'use client';

import { useState } from 'react';
import type { Product } from '@/lib/product-search';
import ChatInput from './ChatInput';
import LeadCapture, { Lead } from './LeadCapture';
import Message, { ChatMessage } from './Message';
import ProductCard from './ProductCard';
import QuickPrompts from './QuickPrompts';

const starterMessages: ChatMessage[] = [
  {
    role: 'assistant',
    content:
      'Xin chào! Em là trợ lý AI của The Tool Center. Anh/chị cần tư vấn máy theo nhu cầu, tra cứu SKU hay hỏi về bảo hành?',
  },
];

export default function ChatBox() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [products, setProducts] = useState<Product[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
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
      setProducts(data.products || []);
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

  function handleLeadSubmit(lead: Lead) {
    setLeads((current) => [lead, ...current]);
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        content: `Em đã lưu lead: ${lead.name} - ${lead.phone}. Bước tiếp theo sẽ kết nối email/CRM để chuyển sale xử lý.`,
      },
    ]);
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
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

        <QuickPrompts onPick={handleSend} />
        <ChatInput disabled={loading} onSend={handleSend} />
      </div>

      <aside className="space-y-4">
        <LeadCapture onSubmit={handleLeadSubmit} />

        <section className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Sản phẩm liên quan</h2>
            <span className="text-xs text-slate-500">{products.length} kết quả</span>
          </div>
          <div className="space-y-3">
            {products.length ? (
              products.map((product) => <ProductCard key={product.sku} product={product} />)
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Khi khách hỏi theo SKU, nhu cầu hoặc danh mục, sản phẩm phù hợp sẽ hiển thị tại đây.
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl bg-white p-4 shadow-xl ring-1 ring-slate-200">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">Lead đã lưu</h2>
            <span className="text-xs text-slate-500">{leads.length}</span>
          </div>
          <div className="space-y-2">
            {leads.length ? (
              leads.map((lead, index) => (
                <div key={`${lead.phone}-${index}`} className="rounded-2xl bg-slate-50 p-3 text-xs text-slate-600">
                  <p className="font-bold text-slate-900">{lead.name} · {lead.phone}</p>
                  <p>Nhu cầu: {lead.need || 'chưa nhập'}</p>
                  <p>Ngân sách: {lead.budget || 'chưa nhập'}</p>
                </div>
              ))
            ) : (
              <p className="rounded-2xl bg-slate-50 p-4 text-xs leading-5 text-slate-500">
                Chưa có lead. Bước sau sẽ kết nối email/CRM để lưu tự động.
              </p>
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
