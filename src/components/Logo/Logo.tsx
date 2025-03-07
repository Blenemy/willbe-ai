import Image from "next/image";
import logo from "@/assets/logo.png";
import circleLogo from "@/assets/circle_logo.png";

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
