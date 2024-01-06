import "@/styles/globals.css";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { headers } from "next/headers";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/nav/nav-bar";
import { Toaster } from "@/components/ui/toaster";
import { env } from "@/env.mjs";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={inter.className}>
        <Toaster />
        <SonnerToaster />
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-[100dvh] flex-col items-center gap-8">
              {env.NODE_ENV !== "production" && (
                <div className="absolute bottom-[20px] left-0 rounded-lg border border-xslate-5 bg-xslate-7 p-3">
                  <div className="inline-flex flex-col">
                    <span className="sm:hidden">{"<sm"}</span>
                    <span className="md:hidden">{"<md"}</span>
                    <span className="lg:hidden">{"<lg"}</span>
                    <span className="xl:hidden">{"<xl"}</span>
                    <span className="2xl:hidden">{"<2xl"}</span>
                  </div>
                </div>
              )}
              <Navbar />
              {children}
              {/* <div className="inline-flex w-full grow flex-col items-center justify-center">
                
              </div> */}
            </main>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
