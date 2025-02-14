import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
}

const Logo = ({ width = 80, height = 32 }: LogoProps) => {
  return (
    <Image src={"/assets/logo.png"} alt="logo" width={width} height={height} />
  );
};

export default Logo;
