import { Transition } from "@headlessui/react";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, utils } from "ethers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import BoxFrame from "../../../common/components/BoxFrame";
import Button from "../../../common/components/Button";
import LableInput from "../../../common/components/LableInput";
import { getNfts } from "../../Nft/services/nft.service";
import useApprovedNFT from "../hooks/useApprovedNFT";
import useApprovedToken from "../hooks/useApprovedToken";
import useDepositToPool from "../hooks/useDepositToPool";
import useStakeNftToPool from "../hooks/useStakeNftToPool";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  poolId: BigNumber;
  collectionId: string;
  callback?: () => void;
};

const StakedNftModal = ({ show, setShow, poolId, callback, collectionId }: Props) => {
  const { call: deposit, isLoading: isDepositting } = useDepositToPool();
  const session = useSession();
  const filters = useMemo(() => {
    const _filters: Record<string, any> = {
      limit: Number.MAX_SAFE_INTEGER,
      isStaked: false,
      marketId: null,
      owner: session.data?.user.address,
      collectionId,
    };
    return _filters;
  }, [collectionId, session.data?.user.address]);
  const { data, isLoading } = useQuery(["nfts-not-staked", filters], getNfts, {
    enabled: show && !!session.data?.user.address,
  });

  // const onSubmit = handleSubmit(async (values) => {
  //   console.log(`Deposit ${utils.parseEther(values.amount)} to pool ${poolId}`);
  //   await deposit(utils.parseEther(values.amount), poolId);
  //   setShow(false);
  //   callback?.();
  // });

  const nfts = data?.docs || [];

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <div className="bg-[#0C1226] w-full max-w-[90vw]">
          <BoxFrame className="p-8">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">My NFTs</div>
              <button type="button" disabled={isDepositting} onClick={() => setShow(false)}>
                <svg
                  className="w-6 h-6 text-white fill-current"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="grid mt-6 xs-grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 max-h-[500px] overflow-y-auto gap-2 md:gap-3 lg:gap-4 xl:gap-5">
              {nfts.map((nft) => (
                <NFTItem callback={callback} poolId={poolId} key={nft.tokenId} nft={nft} />
              ))}
            </div>
          </BoxFrame>
        </div>
      </div>
    </Transition>
  );
};

type ItemProps = {
  nft: Awaited<ReturnType<typeof getNfts>>["docs"][number];
  poolId: BigNumber | string;
  callback?: () => void;
};
const NFTItem = ({ nft, poolId, callback }: ItemProps) => {
  const { approve, isChecking, isApproved, isApproving } = useApprovedNFT(
    process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!,
    process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!,
    nft.tokenId
  );
  const { call: stake, isLoading: isStaking } = useStakeNftToPool();

  const handleClick = useCallback(async () => {
    if (!isApproved) {
      await approve();
      return;
    }
    await stake(nft.tokenId, poolId);
    callback?.();
    return;
  }, [approve, callback, isApproved, nft.tokenId, poolId, stake]);

  return (
    <BoxFrame key={nft.tokenId} className="p-5">
      <div className="aspect-square bg-gray-500/20">
        <Image
          src={`/api/imageProxy?imageUrl=https://${nft.tokenURI}.ipfs.w3s.link/`}
          alt="Gallery"
          width={290}
          height={290}
          className="object-cover aspect-square"
        />
      </div>
      <div className="mt-5 space-y-3">
        <div className="flex items-center justify-between text-[24px] font-bold text-white">
          {nft.name} #{nft.tokenId}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[15px] text-[#6B7280] font-bold">Power</span>
          <span className="text-white font-bold text-[20px]">{nft.tokenPower}</span>
        </div>
        <Button
          onClick={handleClick}
          type="submit"
          isLoading={isChecking || isApproving || isStaking}
          className="w-full"
        >
          {isChecking ? "Checking..." : isApproved ? "Stake" : "Approve"}
        </Button>
      </div>
    </BoxFrame>
  );
};

export default StakedNftModal;
