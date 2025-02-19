import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  isCircleLogo?: boolean;
}

const Logo = ({ width = 80, height = 32, isCircleLogo = false }: LogoProps) => {
  return (
    <Image
      src={isCircleLogo ? "/assets/circle_logo.png" : "/assets/logo.png"}
      alt="logo"
      width={width}
      height={height}
    />
  );
};

export default Logo;
