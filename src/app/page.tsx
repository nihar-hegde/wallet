import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-950 text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="#">
          <Wallet className="h-6 w-6 mr-2" />
          <span className="font-bold">CryptoVault</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex flex-col items-center justify-center">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Secure Your Digital Assets
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  CryptoVault: Your trusted companion in the world of
                  cryptocurrencies. Safe, simple, and seamless transactions at
                  your fingertips.
                </p>
              </div>
              <div className="space-x-4">
                <Button className="bg-primary hover:bg-primary/90">
                  <Link href="/onboarding/1">Get Started</Link>
                </Button>
                <Button
                  variant="outline"
                  className="bg-gray-800 text-gray-100 hover:bg-gray-700"
                >
                  <Link href="/dashboard">Login</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-700">
        <p className="text-xs text-gray-400">
          © 2023 CryptoVault. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
