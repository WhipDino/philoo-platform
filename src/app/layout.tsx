import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  IBM_Plex_Mono,
  Nunito,
  Public_Sans,
} from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const reading = Public_Sans({
  variable: "--font-reading",
  subsets: ["latin"],
  display: "swap",
});

const evidence = IBM_Plex_Mono({
  variable: "--font-evidence",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

const brand = Nunito({
  variable: "--font-brand",
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Philoo — Filosofia para investigar o mundo",
    template: "%s · Philoo",
  },
  description:
    "Uma plataforma de filosofia para observar, investigar e revisar ideias.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${reading.variable} ${evidence.variable} ${brand.variable}`}
    >
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o conteúdo
        </a>
        {children}
      </body>
    </html>
  );
}
