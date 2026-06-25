export type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm ${
          isUser
            ? 'bg-emerald-600 text-white'
            : 'bg-white text-slate-800 ring-1 ring-slate-200'
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}
