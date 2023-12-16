import "@/styles/globals.css";
import { headers } from "next/headers";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/nav/nav-bar";
import { Toaster } from "@/components/ui/toaster";

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
        <Toaster />
        <TRPCReactProvider headers={headers()}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="flex min-h-screen flex-col items-center gap-8">
              <div className="absolute left-0 top-12">
                <div className="inline-flex flex-col">
                  <span className="sm:hidden">{"<=sm"}</span>
                  <span className="md:hidden">sm</span>
                  <span className="lg:hidden">md</span>
                  <span className="xl:hidden">lg</span>
                  <span className="2xl:hidden">xl</span>
                </div>
              </div>
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
