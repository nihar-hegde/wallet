"use client";
import { buttonVariants } from "@/components/ui/button";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleOnClick = () => {
    router.push("/onboarding/1");
  };

  return (
    <HeroHighlight>
      <div className="flex flex-col items-center justify-center gap-8">
        <motion.h1
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-2xl px-4 md:text-4xl lg:text-5xl font-bold  text-white max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          Welcome to CryptoVault Your trusted companion in the world of
          cryptocurrencies.
        </motion.h1>
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
          className="text-sm font-bold text-neutral-500 max-w-4xl leading-relaxed lg:leading-snug text-center mx-auto "
        >
          <Link
            href={
              "https://github.com/nihar-hegde/wallet?tab=readme-ov-file#demo"
            }
          >
            *Click here to watch a demo
          </Link>
        </motion.p>
        <motion.div
          className="flex flex-row items-center gap-4"
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: [20, -5, 0],
          }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0.0, 0.2, 1],
          }}
        >
          <HoverBorderGradient
            containerClassName="rounded-full"
            as="button"
            className="bg-black  text-white  flex items-center space-x-2"
            onClick={handleOnClick}
          >
            <span>Get Started</span>
            <ChevronRight />
          </HoverBorderGradient>
        </motion.div>
      </div>
    </HeroHighlight>
  );
}
