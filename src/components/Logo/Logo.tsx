import Image from "next/image";
import logo from "@/assets/new_logo.svg";
import circleLogo from "@/assets/new_logo_circle.svg";

interface LogoProps {
  width?: number;
  height?: number;
  isCircleLogo?: boolean;
}

const Logo = ({ width = 80, height = 32, isCircleLogo = false }: LogoProps) => {
  return (
    <Image
      src={isCircleLogo ? circleLogo : logo}
      alt="logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;
