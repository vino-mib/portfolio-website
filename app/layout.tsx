import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

const themeInit = `(function(){try{var s=localStorage.getItem("theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.setAttribute("data-theme",t);}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export const metadata: Metadata = {
  title: "Vinothkumar Chandrasekaran | Lead Software Engineer",
  description:
    "Lead Software Engineer with 16 years of experience in cloud-native systems, event-driven architecture and GenAI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="bg-bg pb-16 font-sans text-base leading-[1.6] text-fg antialiased sm:pb-0 sm:pl-[68px]">
        {children}
      </body>
    </html>
  );
}
