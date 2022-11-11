import { BigNumber, Contract, providers } from "ethers";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTxMessage } from "../../../common/utils/tx";

type Result = {
  call: (duration: string | BigNumber, poolId: string | BigNumber) => Promise<void>;
  isLoading: boolean;
};

const useSetPoolRewardDuration = () => {
  const [isLoading, setIsLoading] = useState(false);

  const call: Result["call"] = useCallback(async (duration, poolId) => {
    if (!window.ethereum) {
      toast.error("We currently only support Metamask. Please install Metamask to continue.");
      return;
    }
    setIsLoading(true);
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function setRewardsDuration(uint256,uint256)"];
    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!;
    const contract = new Contract(contractAddress, abi, provider.getSigner());
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      setIsLoading(true);
      toastId = toast.info("Setting reward duration...", {
        autoClose: false,
      });
      const tx = await contract.setRewardsDuration(duration, poolId);
      toast.update(toastId, {
        render: "Transaction sent. Waiting for confirmation...",
        type: toast.TYPE.INFO,
        autoClose: false,
      });
      await tx.wait();
      toast.update(toastId, {
        render: "Reward duration set successfully",
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

export default useSetPoolRewardDuration;
