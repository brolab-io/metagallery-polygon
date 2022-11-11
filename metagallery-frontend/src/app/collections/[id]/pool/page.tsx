"use client";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { BigNumber, utils } from "ethers";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import BoxFrame from "../../../../common/components/BoxFrame";
import Button from "../../../../common/components/Button";
import Countdown from "../../../../common/components/Countdown";
import H1 from "../../../../common/components/H1";
import LoadingIcon from "../../../../common/components/LoadingIcon";
import { getCollection } from "../../../../features/Collection/services/collection.service";
import AddRewardModal from "../../../../features/Pool/components/AddRewardModal";
import DepositModal from "../../../../features/Pool/components/DepositModal";
import SetPoolRewardDurationModal from "../../../../features/Pool/components/SetPoolRewardDurationModal";
import StakedNftModal from "../../../../features/Pool/components/StakedNftModal";
import useCreatePool from "../../../../features/Pool/hooks/useCreatePool";
import useGetPoolId from "../../../../features/Pool/hooks/useGetPoolId";
import useGetPoolInfo from "../../../../features/Pool/hooks/useGetPoolIInfo";
import useMyPoolStakeInfo from "../../../../features/Pool/hooks/useMyPoolStakeInfo";

type Props = {
  params: {
    id: string;
  };
};

function formatToken(value: BigNumber) {
  // 123456789.123456789 => 123,456,789.1234
  // 123.456789 => 123.4567
  // 0.000000000000000001 => 0.0000
  // 0.000000000000000000 => 0.0000
  return (
    utils
      .formatUnits(value, 18)
      // Remove numbers after 4th decimal point
      .replace(/(\.\d{4})\d+/, "$1")
      // Add commas only to numbers before decimal point
      .replace(/^(\d+)(\.\d+)?$/, (match, number, decimal) => {
        return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + decimal;
      })
  );
}

const PoolItemPage = ({ params: { id: collectionId } }: Props) => {
  const { data: collection } = useQuery(
    [
      "collection",
      {
        collectionId,
      },
    ],
    getCollection
  );
  const session = useSession();
  const isOwner =
    !!collection && session?.data?.user.address.toLowerCase() === collection?.collectionOwner;

  const { isLoading: isLoadingPoolId, data, refetch: getpoolId } = useGetPoolId(collectionId);
  const {
    call: createPool,
    isLoading: isCreatingPool,
    isCreatedPool,
  } = useCreatePool(collectionId);
  const [isPoolCreated, poolId] = data ?? [];
  const {
    data: poolInfo,
    isLoading: isLoadingPoolInfo,
    refetch,
  } = useGetPoolInfo(poolId || "0", {
    enabled: !!isPoolCreated || isCreatedPool,
  });
  const { data: myStakeInfo } = useMyPoolStakeInfo(
    session.data?.user.address || "",
    poolId || "0",
    {
      enabled: !!session.data?.user.address || isCreatedPool,
    }
  );
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSetPoolRewardDurationModalOpen, setIsSetPoolRewardDurationModalOpen] = useState(false);
  const [isShowModalStakedNft, setIsShowModalStakedNft] = useState(false);
  const [isShowAddRewardModal, setIsShowAddRewardModal] = useState(false);

  useEffect(() => {
    if (isCreatedPool) {
      getpoolId();
    }
  }, [isCreatedPool, getpoolId]);

  if (isLoadingPoolId || !isPoolCreated || !poolInfo || !poolId) {
    return (
      <BoxFrame className="py-[176px]">
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
          {isLoadingPoolId || (isPoolCreated && isLoadingPoolInfo) ? (
            <LoadingIcon className="w-20 h-20 fill-current text-primary" />
          ) : isOwner ? (
            <Button onClick={createPool} isLoading={isCreatingPool}>
              CREATE POOL
            </Button>
          ) : (
            <H1 className="text-center">This collection has no pool</H1>
          )}
        </div>
      </BoxFrame>
    );
  }

  const [
    duration,
    finishAt,
    updatedAt,
    rewardRate,
    rewardPerTokenStored,
    totalSupply,
    _,
    poolBalance,
  ] = poolInfo;

  // console.log({
  //   duration,
  //   finishAt,
  //   updatedAt,
  //   rewardRate,
  //   rewardPerTokenStored,
  //   totalSupply,
  //   _,
  //   poolBalance,
  // });

  const [earned, rewardPerToken, powerStaked] = myStakeInfo ?? [];

  return (
    <>
      <DepositModal
        poolId={poolId}
        show={isDepositModalOpen}
        callback={refetch}
        setShow={setIsDepositModalOpen}
      />
      <SetPoolRewardDurationModal
        poolId={poolId}
        show={isSetPoolRewardDurationModalOpen}
        callback={refetch}
        setShow={setIsSetPoolRewardDurationModalOpen}
      />
      <StakedNftModal
        collectionId={collectionId}
        poolId={poolId}
        show={isShowModalStakedNft}
        callback={refetch}
        setShow={setIsShowModalStakedNft}
      />
      <AddRewardModal
        poolId={poolId}
        show={isShowAddRewardModal}
        callback={refetch}
        setShow={setIsShowAddRewardModal}
      />
      <div className="flex items-center space-x-5 pb-9">
        <H1 className="text-white/80">Pool Fund: {formatToken(poolBalance)} BROB</H1>
        {isOwner && (
          <div>
            <Button sm onClick={() => setIsDepositModalOpen(true)}>
              ADD FUND
            </Button>
          </div>
        )}
      </div>
      <BoxFrame className="py-[76px]">
        <div className="flex flex-col items-center font-bold">
          <h2 className="text-[48px] text-white">Pool Reward</h2>
          <div className="flex items-center space-x-4">
            <Image
              src="/assets/images/icon-token.svg"
              className="h-[96px] w-[96px]"
              alt="token"
              height={64}
              width={64}
            />
            <span className="text-[96px] text-white">{formatToken(rewardRate.mul(duration))}</span>
          </div>
          <span className="text-[48px] text-[#8E8F99]">
            ~ $ {formatToken(rewardRate.mul(duration).mul(39).div(100))}
          </span>
          {isOwner && (
            <Button
              className="absolute right-8 bottom-8"
              sm
              onClick={() => setIsShowAddRewardModal(true)}
            >
              ADD Reward
            </Button>
          )}
        </div>
      </BoxFrame>
      <div className="grid gap-5 py-10 md:grid-cols-2 lg:grid-cols-3">
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 md:space-y-6 xl:space-y-8">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              Earned
            </div>
            <div className="flex items-center justify-between">
              <div className="lg:text-[56px] md:text-[48px] sm:text-[40px] text-[32px] xl:text-[64px] font-bold text-white flex items-center space-x-3">
                <Image
                  src="/assets/images/icon-token.svg"
                  className="lg:w-[56px] md:w-[48px] sm:w-[40px] w-[32px] xl:w-[64px] lg:h-[56px] md:h-[48px] sm:h-[40px] h-[32px] xl:h-[64px]"
                  alt="token"
                  height={64}
                  width={64}
                />
                <span>{earned ? formatToken(earned) : 0}</span>
              </div>
              <div>
                <Button sm>HARVEST</Button>
              </div>
            </div>
          </div>
        </BoxFrame>
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 md:space-y-6 xl:space-y-8">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              Total Staked (Power)
            </div>
            <div className="flex items-center justify-between">
              <div className="lg:text-[56px] md:text-[48px] sm:text-[40px] text-[32px] xl:text-[64px] font-bold text-white">
                {totalSupply.toString()}
              </div>
            </div>
          </div>
        </BoxFrame>
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 md:space-y-6 xl:space-y-8">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              My Staked (Power)
            </div>
            <div className="flex items-center justify-between">
              <div className="lg:text-[56px] md:text-[48px] sm:text-[40px] text-[32px] xl:text-[64px] font-bold text-white">
                {powerStaked ? powerStaked.toString() : 0}
              </div>
              <div>
                <Button onClick={() => setIsShowModalStakedNft(true)} sm>
                  STAKE
                </Button>
              </div>
            </div>
          </div>
        </BoxFrame>
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 lg:space-y-6">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              Reward Reset in
            </div>
            <div className="relative flex items-center">
              <div
                className={clsx(
                  "lg:text-[40px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[48px] font-bold text-white",
                  "text-[24px] leading-[28px]",
                  "sm:text-[28px] leading-[32px]",
                  "md:text-[32px] leading-[36px]",
                  "lg:text-[40px] leading-[44px]",
                  "xl:text-[48px] leading-[52px]"
                )}
              >
                <Countdown unixTime={finishAt.toNumber()} />
              </div>
              {isOwner && (
                <div className="absolute right-0 bottom-1">
                  <Button onClick={() => setIsSetPoolRewardDurationModalOpen(true)} sm>
                    SET DURATION
                  </Button>
                </div>
              )}
            </div>
          </div>
        </BoxFrame>
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 md:space-y-6 xl:space-y-8">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              Reward Rate
            </div>
            <div className="flex items-center justify-between">
              <div className="lg:text-[56px] md:text-[48px] sm:text-[40px] text-[32px] xl:text-[64px] font-bold text-white flex items-center space-x-3">
                <Image
                  src="/assets/images/icon-token.svg"
                  className="lg:w-[56px] md:w-[48px] sm:w-[40px] w-[32px] xl:w-[64px] lg:h-[56px] md:h-[48px] sm:h-[40px] h-[32px] xl:h-[64px]"
                  alt="token"
                  height={64}
                  width={64}
                />
                <span>{formatToken(rewardRate)}</span>
              </div>
            </div>
          </div>
        </BoxFrame>
        <BoxFrame className="py-[38px] px-[34px]">
          <div className="space-y-4 md:space-y-6 xl:space-y-8">
            <div className="lg:text-[36px] md:text-[32px] sm:text-[28px] text-[24px] xl:text-[40px] font-bold text-white">
              1 Power/24h to get
            </div>
            <div className="flex items-center justify-between">
              <div className="lg:text-[56px] md:text-[48px] sm:text-[40px] text-[32px] xl:text-[64px] font-bold text-white flex items-center space-x-3">
                <Image
                  src="/assets/images/icon-token.svg"
                  className="lg:w-[56px] md:w-[48px] sm:w-[40px] w-[32px] xl:w-[64px] lg:h-[56px] md:h-[48px] sm:h-[40px] h-[32px] xl:h-[64px]"
                  alt="token"
                  height={64}
                  width={64}
                />
                <span>
                  {totalSupply.eq(0)
                    ? 0
                    : formatToken(rewardRate.div(totalSupply).mul(24 * 60 * 60))}
                </span>
              </div>
            </div>
          </div>
        </BoxFrame>
      </div>
    </>
  );
};

export default PoolItemPage;
