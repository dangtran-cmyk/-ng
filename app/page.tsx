import ChatBox from '@/components/ChatBox';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8">
      <section className="mx-auto max-w-5xl">
        <div className="mb-6 rounded-3xl bg-slate-950 p-8 text-white shadow-xl">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">
            The Tool Center
          </p>
          <h1 className="text-3xl font-bold md:text-5xl">AI Sales Assistant</h1>
          <p className="mt-4 max-w-2xl text-slate-200">
            Chatbot tư vấn máy, dụng cụ, pin, sạc, bảo hành và thu lead khách hàng cho The Tool Center.
          </p>
        </div>
        <ChatBox />
      </section>
    </main>
  );
}
