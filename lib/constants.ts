export const UI_CLASSES = {
  input:
    "w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all",
  select:
    "w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer",
  label:
    "text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1.5 block px-1",
  card: "rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm overflow-hidden",
  buttonPrime:
    "px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20",
  buttonGhost:
    "px-6 py-2.5 rounded-full border border-white/10 text-white text-sm font-semibold hover:bg-white/5 transition-all",
};

export const COMMON_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
};
