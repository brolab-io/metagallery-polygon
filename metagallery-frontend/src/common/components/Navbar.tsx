"use client";
import clsx from "clsx";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import Container from "./Container";
import Logo from "./Logo";
import { usePathname } from "next/navigation";

const menus = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Marketplace",
    href: "/marketplace",
  },
  {
    title: "Collections",
    href: "/collections",
  },
  // {
  //   title: "Pools",
  //   href: "/pools",
  // },
  // {
  //   title: "My NFTs",
  //   href: "/my-nfts",
  // },
  // {
  //   title: "Mint NFT",
  //   href: "/mint",
  // },
];

function checkActive(href: string, pathname: string | null) {
  if (!pathname) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname.startsWith(href);
}

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="h-[108px] fixed inset-x-0 top-0 flex items-center bg-[#141A31] z-40">
      <Container xxxl className="relative flex items-center justify-between w-full">
        <Link href="/">
          <div className="flex items-center space-x-3">
            <Logo />
            <div className="text-3xl font-bold leading-7 tracking-normal text-white uppercase">
              MetaGallery
            </div>
          </div>
        </Link>
        <div className="absolute inset-y-0 flex items-center space-x-8 font-bold leading-6 text-white uppercase -translate-x-1/2 left-1/2">
          {menus.map((menu, index) => {
            const isActive = checkActive(menu.href, pathname);
            return (
              <Link className="cursor-pointer" key={index} href={menu.href}>
                <span
                  className={clsx(
                    isActive && "text-primary",
                    "font-bold text-[16px] py-2 hover:text-primary transition-colors"
                  )}
                >
                  {menu.title}
                </span>
              </Link>
            );
          })}
        </div>
        <ConnectButton />
      </Container>
    </div>
  );
};

export default Navbar;
