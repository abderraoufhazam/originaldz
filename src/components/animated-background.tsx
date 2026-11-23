export default function AnimatedBackground() {
  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden bg-ivory-50"
      aria-hidden="true"
    >
      <div className="absolute -top-24 -start-24 h-[30rem] w-[30rem] rounded-full bg-brand-500/15 blur-3xl animate-blob" />
      <div
        className="absolute top-1/3 -end-28 h-[28rem] w-[28rem] rounded-full bg-accent-400/20 blur-3xl animate-blob"
        style={{ animationDelay: '3s' }}
      />
      <div
        className="absolute bottom-0 start-1/4 h-[26rem] w-[26rem] rounded-full bg-brand-400/15 blur-3xl animate-blob"
        style={{ animationDelay: '6s' }}
      />
      <div
        className="absolute bottom-1/4 end-1/4 h-[22rem] w-[22rem] rounded-full bg-accent-300/15 blur-3xl animate-blob"
        style={{ animationDelay: '9s' }}
      />
    </div>
  );
}
