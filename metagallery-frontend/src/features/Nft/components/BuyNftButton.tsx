"use client";

import { BigNumber, constants, Contract, providers } from "ethers";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ComponentProps, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import Button from "../../../common/components/Button";
import { getTxMessage } from "../../../common/utils/tx";
import { fetchMarketNft, fetchNft } from "../services/nft.service";

type Props = {
  nft: Awaited<ReturnType<typeof fetchMarketNft>>;
} & ComponentProps<typeof Button>;
const BuyNftButton = ({ nft, ...props }: Props) => {
  const session = useSession();
  const isSignedIn = session.status === "authenticated";
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const router = useRouter();

  const checkIsApproved = useCallback(async () => {
    try {
      if (!nft || !session.data) {
        return;
      }
      if (!window.ethereum) {
        return toast.error(
          "We currently only support Metamask. Please install Metamask to continue."
        );
      }
      setIsLoading(true);
      const provider = new providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();
      const contract = new Contract(
        nft.marketPaymentToken,
        ["function allowance(address, address) public view returns (uint256)"],
        signer
      );
      const allowedToken = await contract.allowance(
        session.data.user.address,
        process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS
      );
      const isApproved = await allowedToken.gte(BigNumber.from(nft.marketPrice));
      setIsApproved(isApproved);
    } catch (error) {
      const message = getTxMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [nft, session.data]);

  const approveToken = useCallback(async () => {
    if (!window.ethereum) {
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      if (!nft || !session.data) {
        return;
      }
      setIsLoading(true);
      const provider = new providers.Web3Provider(window.ethereum as any);
      const signer = provider.getSigner();

      const contract = new Contract(
        nft.marketPaymentToken,
        ["function approve(address, uint256)"],
        signer
      );
      const tx = await contract.approve(
        process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS,
        constants.MaxUint256
      );

      toastId = toast.info("Approving, please wait...", {
        autoClose: false,
      });

      await tx.wait();
      toast.update(toastId, {
        render: "Token approved successfully",
        type: "success",
        autoClose: 3000,
      });
      toastId = null;
      setIsApproved(true);
    } catch (error) {
      const message = getTxMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  }, [nft, session.data]);

  const buyNFT = useCallback(async () => {
    if (!window.ethereum) {
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    setIsLoading(true);
    const provider = new providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const abi = ["function executeOrder(uint256)"];
    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS!,
      abi,
      signer
    );
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      const tx = await contract.executeOrder(nft!.marketId);
      toastId = toast.info("Buying, please wait...", {
        autoClose: false,
      });
      await tx.wait();
      toast.update(toastId, {
        render: "NFT bought successfully",
        type: "success",
        autoClose: 3000,
      });
      router.push(`/nfts/${nft!.tokenId}`);
    } catch (error) {
      const message = getTxMessage(error);
      toast.error(message);
    } finally {
      setIsLoading(false);
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  }, [nft, router]);

  const cancelSale = useCallback(async () => {
    if (!window.ethereum) {
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    setIsLoading(true);
    const provider = new providers.Web3Provider(window.ethereum as any);
    const signer = provider.getSigner();
    const abi = ["function cancelOrder(uint256)"];
    const contract = new Contract(
      process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS!,
      abi,
      signer
    );
    let toastId: ReturnType<typeof toast> | null = null;
    try {
      const tx = await contract.cancelOrder(nft!.marketId);
      toastId = toast.info("Cancelling sale, please wait...", {
        autoClose: false,
      });
      await tx.wait();
      toast.update(toastId, {
        render: "Sale cancelled successfully",
        type: "success",
        autoClose: 3000,
      });
      router.push(`/nfts/${nft!.tokenId}`);
    } catch (error) {
      const message = getTxMessage(error);
      toast.error(message);
      console.log(error);
    } finally {
      setIsLoading(false);
      if (toastId) {
        toast.dismiss(toastId);
      }
    }
  }, [nft, router]);

  useEffect(() => {
    checkIsApproved();
  }, [checkIsApproved]);

  const isOwner = session.data?.user.address.toLowerCase() === nft.owner;

  const buttonTitle = useMemo(() => {
    if (isOwner) return "Cancel Listing";
    if (isApproved) {
      return "Buy NFT";
    }
    return "Approve Token";
  }, [isApproved, isOwner]);

  const handleButtonClick = useCallback(() => {
    if (isOwner) {
      return cancelSale();
    }
    if (isApproved) {
      return buyNFT();
    }
    return approveToken();
  }, [approveToken, buyNFT, cancelSale, isApproved, isOwner]);

  if (!isSignedIn) {
    return null;
  }
  return (
    <Button onClick={handleButtonClick} disabled={isLoading} {...props}>
      {buttonTitle}
    </Button>
  );
};

export default BuyNftButton;
