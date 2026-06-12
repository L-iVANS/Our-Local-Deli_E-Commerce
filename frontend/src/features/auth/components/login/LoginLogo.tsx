import Image from "next/image";
import omegaLogo from "../../../../assets/omega_logo.png";

export const LoginLogo = () => (
  <div className="hidden lg:block fixed top-6 right-6 text-right z-50">
    <Image
      src={omegaLogo}
      alt="Omega Logo"
      width={180}
      height={60}
      className="h-auto w-auto"
    />
    <div className="text-gray-400 text-xs tracking-widest uppercase mt-2">B2B Partner Portal</div>
  </div>
);
