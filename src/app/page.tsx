"use client";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
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
        <motion.div
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
