export const UI_CLASSES = {
  input:
    "h-10 w-full rounded-md border border-line-strong bg-background px-3 text-sm text-foreground placeholder:text-subtle outline-none transition-shadow focus:border-primary/60 focus:shadow-[0_0_0_3px_rgb(67_56_202/0.12)]",
  select:
    "h-10 w-full rounded-md border border-line-strong bg-background px-3 text-sm text-foreground outline-none cursor-pointer focus:border-primary/60",
  label: "text-[13px] text-muted-foreground mb-2 block",
  card: "rounded-xl border border-border bg-card overflow-hidden",
  buttonPrime:
    "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-white shadow-[0_1px_2px_rgb(67_56_202/0.25)] transition-colors hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed",
  buttonGhost:
    "inline-flex h-10 items-center justify-center gap-2 rounded-md border border-line-strong bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-bg-300",
};

export const COMMON_ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  },
};
