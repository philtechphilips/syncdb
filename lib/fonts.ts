import { Newsreader } from "next/font/google";

// Serif for headlines on the landing and auth pages.
export const display = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  axes: ["opsz"],
  display: "swap",
});
