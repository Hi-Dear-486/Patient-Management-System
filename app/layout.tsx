import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastContainer } from "react-toastify";
import AppContext from "@/context/AppContext";

export const metadata: Metadata = {
  title: "CarePulse",
  description: "A healthcare management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-dark-300 font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark">
          <AppContext>{children}</AppContext>

          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  );
}
