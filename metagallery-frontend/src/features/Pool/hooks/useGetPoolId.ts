import { BigNumber, Contract, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

type Result = {
  data: [boolean, BigNumber] | null;
  isLoading: boolean;
  error: Error | null;
};

const useGetPoolId = (collectionId: string) => {
  const [result, setResult] = useState<Result>({
    data: null,
    isLoading: true,
    error: null,
  });

  const checkIsPoolCreated = useCallback(async () => {
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
    const abi = ["function getPoolIdByCollectionId(uint256) public view returns (bool,uint256)"];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider);
    try {
      console.log(
        `Checking if pool for collection ${collectionId} is created...`,
        process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!
      );
      const result = await contract.getPoolIdByCollectionId(collectionId);
      console.log("Pool created result", result);
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
      console.log(error);
    }
  }, [collectionId]);

  useEffect(() => {
    checkIsPoolCreated();
  }, [checkIsPoolCreated]);

  return useMemo(() => ({ ...result, refetch: checkIsPoolCreated }), [checkIsPoolCreated, result]);
};

export default useGetPoolId;
