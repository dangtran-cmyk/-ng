'use client';

import { FormEvent, useState } from 'react';

export type Lead = {
  name: string;
  phone: string;
  need: string;
  budget: string;
};

export default function LeadCapture({ onSubmit }: { onSubmit: (lead: Lead) => void }) {
  const [lead, setLead] = useState<Lead>({ name: '', phone: '', need: '', budget: '' });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lead.name || !lead.phone) return;
    onSubmit(lead);
    setLead({ name: '', phone: '', need: '', budget: '' });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
      <h3 className="text-sm font-bold text-emerald-900">Chuyển sale tư vấn nhanh</h3>
      <p className="mt-1 text-xs text-emerald-800">
        Nhập thông tin khách để lưu lead tư vấn. Bản hiện tại lưu trong hội thoại, bước sau sẽ gửi về email/CRM.
      </p>
      <div className="mt-3 grid gap-2 md:grid-cols-2">
        <input
          value={lead.name}
          onChange={(event) => setLead({ ...lead, name: event.target.value })}
          placeholder="Tên khách"
          className="rounded-xl border border-emerald-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
        />
        <input
          value={lead.phone}
          onChange={(event) => setLead({ ...lead, phone: event.target.value })}
          placeholder="Số điện thoại"
          className="rounded-xl border border-emerald-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
        />
        <input
          value={lead.need}
          onChange={(event) => setLead({ ...lead, need: event.target.value })}
          placeholder="Nhu cầu"
          className="rounded-xl border border-emerald-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
        />
        <input
          value={lead.budget}
          onChange={(event) => setLead({ ...lead, budget: event.target.value })}
          placeholder="Ngân sách"
          className="rounded-xl border border-emerald-200 px-3 py-2 text-xs outline-none focus:border-emerald-500"
        />
      </div>
      <button className="mt-3 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white">
        Lưu lead
      </button>
    </form>
  );
}
