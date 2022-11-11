import { Contract, providers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTxMessage } from "../../../common/utils/tx";

type Result = {
  call: () => Promise<void>;
  isLoading: boolean;
};

const useCreatePool = (collectionId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatedPool, setIsCreatedPool] = useState(false);

  const call: Result["call"] = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("We currently only support Metamask. Please install Metamask to continue.");
      return;
    }
    setIsLoading(true);
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function createPool(uint256)"];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider.getSigner());
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      setIsLoading(true);
      toastId = toast.info("Creating pool...", {
        autoClose: false,
      });
      const tx = await contract.createPool(collectionId);
      toast.update(toastId, {
        render: "Transaction sent. Waiting for confirmation...",
        type: toast.TYPE.INFO,
        autoClose: false,
      });
      await tx.wait();
      toast.update(toastId, {
        render: "Pool created successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      });
      setIsCreatedPool(true);
    } catch (error) {
      if (toastId) {
        toast.update(toastId, {
          render: getTxMessage(error),
          type: toast.TYPE.ERROR,
          autoClose: 3000,
        });
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [collectionId]);

  return useMemo(
    () => ({
      call,
      isLoading,
      isCreatedPool,
    }),
    [call, isLoading, isCreatedPool]
  );
};

export default useCreatePool;
