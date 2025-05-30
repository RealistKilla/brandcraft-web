import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Bakbak_One, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const bakbak = Bakbak_One({
  weight: ["400"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-bakbak",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Brandcraft",
    default: "Brandcraft - AI-Powered Marketing Campaign Platform",
  },
  description:
    "Transform your marketing with AI-powered persona creation and campaign generation. Built for agencies and marketing teams.",
  keywords: [
    "marketing automation",
    "AI marketing",
    "persona generation",
    "campaign planning",
    "content strategy",
  ],
  authors: [{ name: "Developer" }],
  creator: "Developer",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bakbak.className} ${dmSans.className} min-h-screen flex flex-col antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
