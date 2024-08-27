import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <h1 className="text-4xl font-bold mb-8">Welcome to Wallet Web App</h1>
      <Link
        href={"/onboarding/1"}
        className={buttonVariants({ variant: "outline" })}
      >
        Get Started
      </Link>
    </div>
  );
}
