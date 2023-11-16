import "@/styles/globals.css";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/nav/nav-bar";

export const metadata = {
  title: "Trackd",
  description: "Todo description",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main>
              <div className="flex min-h-screen flex-col items-center gap-8">
                <Navbar />
                <div className="inline-flex w-full grow flex-col justify-center items-center">
                  {children}
                </div>
              </div>
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
