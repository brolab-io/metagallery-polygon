import { BigNumber, constants, Contract, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { getTxMessage } from "../../../common/utils/tx";
import useDeepCompareMemo from "./useDeepCompareMemo";

type Data = {
  isApproved: boolean;
  isApproving: boolean;
  isChecking: boolean;
};
type Options = {
  enabled?: boolean;
};
const useApprovedToken = (
  tokenAddress: string,
  spenderAddress: string,
  userAddress: string,
  options?: Options
) => {
  const _options = useDeepCompareMemo(options);
  const [result, setResult] = useState<Data>({
    isApproved: false,
    isApproving: false,
    isChecking: true,
  });

  const checkIsApproved = useCallback(async () => {
    const isEnabled = _options?.enabled ?? true;
    if (!isEnabled) {
      return;
    }
    if (!window.ethereum) {
      setResult({
        isApproved: false,
        isApproving: false,
        isChecking: false,
      });
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function allowance(address,address) view returns (uint256)"];
    const contract = new Contract(tokenAddress, abi, provider);
    try {
      const result: BigNumber = await contract.allowance(userAddress, spenderAddress);
      setResult({
        isApproved: result.gt(0),
        isApproving: false,
        isChecking: false,
      });
    } catch (error) {
      console.log(error);
    }
  }, [_options?.enabled, tokenAddress, userAddress, spenderAddress]);

  const approve = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("We currently only support Metamask. Please install Metamask to continue.");
      return;
    }
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function approve(address,uint256)"];
    const contract = new Contract(tokenAddress, abi, provider.getSigner());
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      toastId = toast.info("Approving token...", {
        autoClose: false,
      });
      setResult({
        isApproved: false,
        isApproving: true,
        isChecking: false,
      });
      const tx = await contract.approve(spenderAddress, constants.MaxUint256);
      await tx.wait();
      toast.update(toastId, {
        render: "Token approved!",
        type: "success",
        autoClose: 3000,
      });
      setResult({
        isApproved: true,
        isApproving: false,
        isChecking: false,
      });
    } catch (error) {
      if (toastId) {
        toast.update(toastId, {
          render: getTxMessage(error),
          type: "error",
          autoClose: 3000,
        });
      }
      setResult({
        isApproved: false,
        isApproving: false,
        isChecking: false,
      });
    }
  }, [tokenAddress, spenderAddress]);

  useEffect(() => {
    checkIsApproved();
  }, [checkIsApproved]);

  return useMemo(
    () => ({
      ...result,
      approve,
    }),
    [result, approve]
  );
};

export default useApprovedToken;
