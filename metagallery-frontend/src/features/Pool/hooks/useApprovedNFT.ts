import { Contract, providers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
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
  tokenId: string,
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
    const abi = ["function getApproved(uint256) public view returns (address)"];
    const contract = new Contract(tokenAddress, abi, provider);
    try {
      const approvedAddress: string = await contract.getApproved(tokenId);
      const isApproved = approvedAddress === spenderAddress;
      setResult({
        isApproved,
        isApproving: false,
        isChecking: false,
      });
    } catch (error) {
      console.log(error);
    }
  }, [_options?.enabled, tokenAddress, tokenId, spenderAddress]);

  const approve = useCallback(async () => {
    if (!window.ethereum) {
      toast.error("We currently only support Metamask. Please install Metamask to continue.");
      return;
    }
    const provider = new providers.Web3Provider(window.ethereum as any);
    const abi = ["function approve(address, uint256)"];
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
      const tx = await contract.approve(spenderAddress, tokenId);
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
          render: "Token approve failed",
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
  }, [tokenAddress, spenderAddress, tokenId]);

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
