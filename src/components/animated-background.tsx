export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-indigo-50 via-violet-50 to-amber-50"
      aria-hidden="true"
    >
      <div className="absolute -top-24 -start-24 h-[30rem] w-[30rem] rounded-full bg-brand-500/20 blur-3xl animate-blob" />
      <div
        className="absolute top-1/3 -end-28 h-[28rem] w-[28rem] rounded-full bg-amber-400/25 blur-3xl animate-blob"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute bottom-0 start-1/4 h-[26rem] w-[26rem] rounded-full bg-violet-400/20 blur-3xl animate-blob"
        style={{ animationDelay: '6s' }}
      />
      <div
        className="absolute bottom-1/4 end-1/4 h-[22rem] w-[22rem] rounded-full bg-rose-300/20 blur-3xl animate-blob"
        style={{ animationDelay: '9s' }}
      />
    </div>
  );
}
