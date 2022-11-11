import Image from "next/image";

const Logo = () => {
  return <Image src="/logo.png" width={40} height={40} alt="Logo" quality={100} />;
};

export default Logo;
