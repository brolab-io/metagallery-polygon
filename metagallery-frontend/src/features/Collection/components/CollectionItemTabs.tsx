"use client";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Button from "../../../common/components/Button";

type Props = {
  owner: string;
};

const CollectionItemTabs = ({ owner }: Props) => {
  const session = useSession();
  const isOwner = session?.data?.user.address.toLowerCase() === owner;
  const pathname = usePathname();
  const segments = pathname?.split("/") || [];
  const lastSegment = segments[segments.length - 1];
  const linkWithouLastSegment = segments.slice(1, segments.length - 1).join("/");

  return (
    <div className="flex items-center justify-between">
      <div className="flex space-x-8">
        <Link href={`/${linkWithouLastSegment}/nfts`}>
          <div
            className={clsx(
              "text-[24px] lg:text-[32px] font-bold text-white py-3",
              lastSegment === "nfts" && "text-primary border-b-4 border-[#17EF97]"
            )}
          >
            NFTs
          </div>
        </Link>
        <Link href={`/${linkWithouLastSegment}/pool`}>
          <div
            className={clsx(
              "text-[24px] lg:text-[32px] font-bold text-white py-3 mb-12",
              lastSegment === "pool" && "text-primary border-b-4 border-[#17EF97]"
            )}
          >
            Pool
          </div>
        </Link>
      </div>
      {isOwner && (
        <div className="mb-12">
          <Button href={`/${linkWithouLastSegment}/mint`}>Mint NFT</Button>
        </div>
      )}
    </div>
  );
};

export default CollectionItemTabs;
