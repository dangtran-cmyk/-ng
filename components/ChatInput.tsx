'use client';

import { FormEvent, useState } from 'react';

export default function ChatInput({
  disabled,
  onSend,
}: {
  disabled?: boolean;
  onSend: (message: string) => void;
}) {
  const [value, setValue] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = value.trim();
    if (!message || disabled) return;
    onSend(message);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 border-t border-slate-200 bg-white p-4">
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Nhập nhu cầu, SKU hoặc câu hỏi của khách..."
        className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
      <button
        disabled={disabled}
        className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        Gửi
      </button>
    </form>
  );
}
