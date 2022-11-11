import { BigNumber, Contract, providers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTxMessage } from "../../../common/utils/tx";

type Result = {
  call: (amount: string | BigNumber, poolId: string | BigNumber) => Promise<void>;
  isLoading: boolean;
};

const useAddRewardAmount = () => {
  const [isLoading, setIsLoading] = useState(false);

  const call: Result["call"] = useCallback(async (amount, poolId) => {
    if (!window.ethereum) {
      toast.error("We currently only support Metamask. Please install Metamask to continue.");
      return;
    }
    setIsLoading(true);
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function notifyRewardAmount(uint256,uint256)"];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider.getSigner());
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      setIsLoading(true);
      console.log(
        `Adding ${amount} to pool ${poolId}`,
        process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS
      );
      toastId = toast.info("Adding reward...", {
        autoClose: false,
      });
      const tx = await contract.notifyRewardAmount(amount, poolId);
      toast.update(toastId, {
        render: "Transaction sent. Waiting for confirmation...",
        type: toast.TYPE.INFO,
        autoClose: false,
      });
      await tx.wait();
      toast.update(toastId, {
        render: "Reward added successfully",
        type: toast.TYPE.SUCCESS,
        autoClose: 3000,
      });
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
  }, []);

  return useMemo(
    () => ({
      call,
      isLoading,
    }),
    [call, isLoading]
  );
};

export default useAddRewardAmount;
