import { display } from "@/lib/fonts";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className={display.variable}>{children}</div>;
}
