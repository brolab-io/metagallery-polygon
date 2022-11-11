import { BigNumber, Contract, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import useDeepCompareMemo from "./useDeepCompareMemo";

type Result = {
  data:
    | [BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]
    | null;
  isLoading: boolean;
  error: Error | null;
};

type Options = {
  enabled?: boolean;
};

const useGetPoolInfo = (poolId: string | BigNumber, options?: Options) => {
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
      "function pools(uint256) public view returns (uint256,uint256,uint256,uint256,uint256,uint256,uint256,uint256)",
    ];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider);
    try {
      const result = await contract.pools(poolId);
      setResult({
        data: result,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setResult({
        data: null,
        isLoading: false,
        error: error as Error,
      });
      toast.error("Something went wrong. Please try again later.");
    }
  }, [poolId, _options]);

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

export default useGetPoolInfo;
