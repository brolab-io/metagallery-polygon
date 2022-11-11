"use client";
import { useQuery } from "@tanstack/react-query";
import { utils } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { getMarketNfts, getNfts } from "../services/nft.service";

type Props = {
  owner?: string;
  orderBy?: string;
  paginationEnabled?: boolean;
  limit?: number;
  collectionId?: string;
  isMarket?: boolean;
};

const NftList: React.FC<Props> = ({
  owner,
  orderBy,
  paginationEnabled,
  limit,
  collectionId,
  isMarket,
}) => {
  const filters = useMemo(() => {
    const filters: Record<string, string | null> = {};
    if (collectionId) {
      filters["collectionId"] = collectionId;
    }
    return filters;
  }, [collectionId]);
  const { data, isLoading, error } = useQuery(
    [
      "nfts",
      {
        limit: limit || 10,
        ...filters,
      },
    ],
    isMarket ? getMarketNfts : getNfts
  );

  const docs = (data?.docs || []) as
    | Awaited<ReturnType<typeof getNfts>>["docs"]
    | Awaited<ReturnType<typeof getMarketNfts>>["docs"];

  return (
    <div className="grid gap-8 mt-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {docs.map((nft) => (
        <Link
          key={nft.tokenId}
          href={
            isMarket && "marketId" in nft ? `/marketplace/${nft.marketId}` : `/nfts/${nft.tokenId}`
          }
        >
          <div className="bg-[#22B78F]/10 border-2 border-primary p-5 space-y-5 w-full">
            <div className="aspect-square bg-gray-500/20">
              <Image
                src={`/api/imageProxy?imageUrl=https://${nft.tokenURI}.ipfs.w3s.link/`}
                alt="Gallery"
                width={290}
                height={290}
                className="object-cover aspect-square"
              />
            </div>
            <div className="w-full truncate text-white font-bold text-[16px] sm:text-[17px] md:text-[18px] lg:text-[19px] xl:text-[20px]">
              {nft.name}
            </div>
            {isMarket && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[15px] text-[#6B7280] font-bold">Powner</span>
                  <span className="text-white font-bold text-[20px]">{nft.tokenPower}</span>
                </div>
                {"marketPrice" in nft && (
                  <div className="flex items-center justify-between">
                    <span className="text-[15px] text-[#6B7280] font-bold">Sale price</span>
                    <span className="text-white font-bold text-[20px]">
                      {utils.formatEther(nft.marketPrice)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default NftList;
