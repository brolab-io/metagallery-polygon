import { BigNumber, Contract, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTxMessage } from "../../../common/utils/tx";
import useDeepCompareMemo from "./useDeepCompareMemo";

type Result = {
  data: [BigNumber, BigNumber, BigNumber] | null;
  isLoading: boolean;
  error: Error | null;
};

type Options = {
  enabled?: boolean;
};

const useMyPoolStakeInfo = (address: string, poolId: string | BigNumber, options?: Options) => {
  const _options = useDeepCompareMemo(options);
  const [result, setResult] = useState<Result>({
    data: null,
    isLoading: true,
    error: null,
  });

  const getPoolInfo = useCallback(async () => {
    const isEnabled = _options?.enabled ?? true;
    if (!isEnabled) {
      return;
    }
    if (!window.ethereum) {
      setResult({
        data: null,
        isLoading: false,
        error: new Error("No ethereum provider found"),
      });
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = [
      "function getUserTotalEarned(address,uint256) public view returns (uint256)",
      "function rewardPerToken(uint256) public view returns (uint256)",
      "function getUserTotalPowerStaked(address,uint256) public view returns (uint256)",
    ];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider);
    try {
      const [earned, rewardPerToken, powerStaked] = await Promise.all([
        contract.getUserTotalEarned(address, poolId),
        contract.rewardPerToken(poolId),
        contract.getUserTotalPowerStaked(address, poolId),
      ]);
      console.log("earned", earned);
      console.log("rewardPerToken", rewardPerToken);
      console.log("powerStaked", powerStaked);
      setResult({
        data: [earned, rewardPerToken, powerStaked],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setResult({
        data: null,
        isLoading: false,
        error: error as Error,
      });
      toast.error(getTxMessage(error));
      console.log(error);
    }
  }, [_options?.enabled, address, poolId]);

  useEffect(() => {
    getPoolInfo();
  }, [getPoolInfo]);

  return useMemo(
    () => ({
      ...result,
      refetch: getPoolInfo,
    }),
    [result, getPoolInfo]
  );
};

export default useMyPoolStakeInfo;
