"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { ComponentProps } from "react";
import Button from "../../../common/components/Button";
import { fetchMarketNft, fetchNft } from "../services/nft.service";

type Props = {
  nft: Awaited<ReturnType<typeof fetchNft>> | Awaited<ReturnType<typeof fetchMarketNft>>;
} & ComponentProps<typeof Button>;
const SellNFTButton = ({ nft, ...props }: Props) => {
  const session = useSession();
  const pathname = usePathname();
  const isSignedIn = session.status === "authenticated";
  if (!isSignedIn) {
    return null;
  }
  const isOwner = session.data!.user.address.toLowerCase() === nft.owner;
  if (!isOwner) {
    return null;
  }
  if ("marketId" in nft) {
    return (
      <Button href={`/marketplace/${nft.marketId}`} {...props}>
        View on Marketplace
      </Button>
    );
  }

  return (
    <Button href={`${pathname}/sell`} {...props}>
      Sell NFT
    </Button>
  );
};

export default SellNFTButton;
