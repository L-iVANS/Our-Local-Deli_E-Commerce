import Link from "next/link";
import Image from "next/image";
import { cn } from "@/src/lib/utils";

const omegaLogo = "/assets/omega_logo_456x150_1_456x150.png";

interface LogoProps {
  href: string;
  className?: string;
  white?: boolean;
}

export function Logo({ href, className, white }: LogoProps) {
  return (
    <Link href={href} className={cn("flex-shrink-0 select-none", className)}>
      <Image 
        src={omegaLogo}
        alt="Omega Logo"
        width={120}
        height={40}
        className={cn(
          "h-auto w-auto transition-all duration-300",
          white && "brightness-0 invert"
        )}
        loading="eager"
      />
    </Link>
  );
}
