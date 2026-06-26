const prompts = [
  'Tôi cần khoan tường bê tông dùng pin',
  'Tư vấn bộ máy cho thợ điện nước khoảng 4 triệu',
  'Có máy thổi bụi dùng pin không?',
  'Tra cứu SKU TRHLI202885',
];

export default function QuickPrompts({ onPick }: { onPick: (value: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3">
      {prompts.map((prompt) => (
        <button
          key={prompt}
          onClick={() => onPick(prompt)}
          className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
}
