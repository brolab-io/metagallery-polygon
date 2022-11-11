import { utils } from "ethers";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import BoxFrame from "../../../common/components/BoxFrame";
import Container from "../../../common/components/Container";
import H1 from "../../../common/components/H1";
import BuyNftButton from "../../../features/Nft/components/BuyNftButton";
import { fetchMarketNft } from "../../../features/Nft/services/nft.service";

type Props = {
  params: {
    id: string;
  };
};

const MarketItemPage = async ({ params: { id: marketId } }: Props) => {
  const nft = await fetchMarketNft("marketId", marketId);

  if (!nft) {
    return notFound();
  }

  const nftContractAddress = process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!.toLowerCase();

  return (
    <Container className="grid gap-20 py-20 lg:grid-cols-3">
      <BoxFrame>
        <div className="py-[52px] px-[39px] space-y-[34px]">
          <Image
            src={`/api/imageProxy?imageUrl=https://${nft.tokenURI}.ipfs.w3s.link/`}
            className="object-cover w-full aspect-square"
            alt="Gallery"
            width={256}
            height={256}
          />
          <div>
            <H1>
              {nft.name} #{nft.tokenId}
            </H1>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[24px] text-[#6B7280] font-bold">Power</span>
              <span className="font-bold text-[32px] text-white">{nft.tokenPower}</span>
            </div>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[24px] text-[#6B7280] font-bold">Price</span>
              <span className="font-bold text-[32px] text-white">
                {utils.formatEther(nft.marketPrice)}
              </span>
            </div>
            <BuyNftButton className="w-full mt-10" nft={nft} />
          </div>
        </div>
      </BoxFrame>
      <div className="lg:col-span-2">
        <H1>On-chain DATa</H1>
        <BoxFrame className="p-16 mt-4">
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Creator</span>
            <Link
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_ADDRESS}/${nft.createdBy}`}
              target="_blank"
            >
              <span className="font-bold text-[32px] text-white hover:text-primary transition-colors">
                {nft.createdBy.slice(0, 6)}...{nft.createdBy.slice(-4)}
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Seller</span>
            <Link
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_ADDRESS}/${nft.owner}`}
              target="_blank"
            >
              <span className="font-bold text-[32px] text-white hover:text-primary transition-colors">
                {nft.owner.slice(0, 6)}...{nft.owner.slice(-4)}
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Contract Address</span>
            <Link
              href={`${process.env.NEXT_PUBLIC_BLOCK_EXPLORER_ADDRESS}/${nftContractAddress}`}
              target="_blank"
            >
              <span className="font-bold text-[32px] text-white hover:text-primary transition-colors">
                {nftContractAddress!.slice(0, 6)}...{nftContractAddress!.slice(-4)}
              </span>
            </Link>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Token ID</span>
            <span className="font-bold text-[32px] text-white">#{nft.tokenId}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Power</span>
            <span className="font-bold text-[32px] text-white">{nft.tokenPower}</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Asset Protocol</span>
            <span className="font-bold text-[32px] text-white">ERC721</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className="text-[24px] text-[#6B7280] font-bold">Asset Public chain</span>
            <span className="font-bold text-[32px] text-white">ETH</span>
          </div>
        </BoxFrame>
        <H1 className="mt-9">Market rules</H1>
        <BoxFrame className="p-16 mt-4 text-[#6B7280] text-[24px]">
          <p>1.NFT can be purchased in the NFT market;</p>
          <p>
            2.After NFT is listed in the trading market, operations such as transfer, auction, and
            stake mining are not allowed;
          </p>
          <p>
            3.The market will charge 3% of the seller’s revenue as a service fee, of which 50% is
            burned, 40% enters the NFT Pool, and 10% is the developer’s revenue;
          </p>
        </BoxFrame>
      </div>
    </Container>
  );
};

export default MarketItemPage;
