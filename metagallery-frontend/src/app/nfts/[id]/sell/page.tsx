"use client";
import { useQuery } from "@tanstack/react-query";
import { BigNumber, Contract, providers, utils } from "ethers";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BoxFrame from "../../../../common/components/BoxFrame";
import Button from "../../../../common/components/Button";
import Container from "../../../../common/components/Container";
import H1 from "../../../../common/components/H1";
import LableInput from "../../../../common/components/LableInput";
import Select from "../../../../common/components/Select";
import { getPaymentTokens } from "../../../../features/Collection/PaymentToken/services/payment-token.service";
import { getNft } from "../../../../features/Nft/services/nft.service";

type Props = {
  params: {
    id: string;
  };
};

type FormValues = {
  paymentToken: string;
  price: string;
};

const NftItemSalePage = (props: Props) => {
  const {
    params: { id: nftId },
  } = props;
  const { data: nft } = useQuery(["nft", "tokenId", nftId], getNft, {
    enabled: !!nftId,
  });
  const { data: paymentTokenData } = useQuery(
    [
      "paymentTokens",
      {
        limit: Number.MAX_SAFE_INTEGER,
      },
    ],
    getPaymentTokens,
    {
      enabled: !!nftId,
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isApproved, setIsApproved] = useState(false);
  const { register, control, handleSubmit } = useForm<FormValues>();
  const router = useRouter();

  const checkIsApproved = useCallback(async () => {
    if (!nft) {
      return;
    }
    if (!window.ethereum) {
      return toast.error(
        "We currently only support Metamask. Please install Metamask to continue."
      );
    }
    const abi = ["function getApproved(uint256) public view returns (address)"];
    // @ts-ignore
    const _provider = new providers.Web3Provider(window.ethereum);
    const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!, abi, _provider);
    const approvedAddress = await contract.getApproved(nft.tokenId);
    setIsApproved(approvedAddress === process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS);
  }, [nft]);

  const approveNFT = useCallback(
    async (signer: any) => {
      let toastId: ReturnType<typeof toast> | null = null;

      const abi = ["function approve(address, uint256)"];
      const contract = new Contract(process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!, abi, signer);
      setIsLoading(true);
      try {
        toastId = toast.info("Approving, please wait...", {
          autoClose: false,
        });
        console.log("approve", process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS!, nftId);
        const tx = await contract.approve(
          process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS!,
          nftId
        );
        await tx.wait();
        setIsApproved(true);
        toast.update(toastId, {
          render: "NFT has been approved for sale",
          type: "success",
          autoClose: 3000,
        });
      } catch (error) {
        if (toastId) {
          toast.update(toastId, {
            render: "Something went wrong, please try again later!",
            type: "error",
            autoClose: 3000,
          });
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [nftId]
  );

  const placeNftOnSale = useCallback(
    async (price: BigNumber, paymentToken: string, signer: any) => {
      let toastId: ReturnType<typeof toast> | null = null;
      console.group(
        `List item ${nftId} on ${process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS}`
      );
      console.log("Payment token", paymentToken);
      console.log("Price", price);
      console.groupEnd();
      const abi = ["function addOrder(uint256,address, uint256)"];
      const contract = new Contract(
        process.env.NEXT_PUBLIC_CONTRACT_MARKETPLACE_ADDRESS!,
        abi,
        signer
      );
      setIsLoading(true);
      try {
        toastId = toast.info("Listing NFT, please wait...", {
          autoClose: false,
        });
        const tx = await contract.addOrder(nftId, paymentToken, price);
        toast.update(toastId, {
          render: "Transaction sent, waiting for confirmation...",
        });
        await tx.wait();
        toast.update(toastId, {
          render: "NFT listed successfully!",
          type: "success",
          autoClose: 3000,
        });
        router.push(`/marketplace`);
      } catch (error) {
        if (toastId) {
          toast.update(toastId, {
            render: "Something went wrong, please try again later!",
            type: "error",
            autoClose: 3000,
          });
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [nftId, router]
  );

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!nft) {
        return;
      }
      if (!window.ethereum) {
        return toast.error(
          "We currently only support Metamask. Please install Metamask to continue."
        );
      }
      // @ts-ignore
      const _provider = new providers.Web3Provider(window.ethereum);
      const signer = _provider.getSigner();

      if (!isApproved) {
        return approveNFT(signer);
      }
      const _price = utils.parseEther(data.price);
      return placeNftOnSale(
        _price,
        data.paymentToken || process.env.NEXT_PUBLIC_CONTRACT_TOKEN_ADDRESS!,
        signer
      );
    },
    [nft, isApproved, placeNftOnSale, approveNFT]
  );

  useEffect(() => {
    checkIsApproved();
  }, [checkIsApproved]);

  if (!nft) {
    return null;
  }

  return (
    <Container className="grid gap-20 py-20 lg:grid-cols-3">
      <BoxFrame>
        <div className="py-[52px] px-[39px] space-y-[34px]">
          <Image
            src={`/api/imageProxy?imageUrl=https://${nft.tokenURI}.ipfs.w3s.link/`}
            className="object-cover w-full aspect-square"
            alt="Gallery"
            width={256}
            height={256}
          />
          <div>
            <H1>
              {nft.name} #{nft.tokenId}
            </H1>
            <div className="flex items-center justify-between mt-3">
              <span className="text-[24px] text-[#6B7280] font-bold">Power</span>
              <span className="font-bold text-[32px] text-white">{nft.tokenPower}</span>
            </div>
          </div>
        </div>
      </BoxFrame>
      <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2">
        <H1>List NFT</H1>
        <BoxFrame className="p-16 mt-4 space-y-5">
          <LableInput label="NFT" value={`${nft.name} #${nft.tokenId}`} disabled />
          <LableInput label="Price" {...register("price")} />
          <Select
            options={(paymentTokenData?.docs || []).map((token) => ({
              label: token.tokenSymbol,
              value: token.tokenAddress,
            }))}
            control={control}
            label="Payment Token"
            placeholder="Select Payment Token"
            {...register("paymentToken")}
          />
          <div>
            <Button type="submit" className="mt-5" isLoading={isLoading}>
              {!isApproved ? "Approve NFT" : "List NFT"}
            </Button>
          </div>
        </BoxFrame>
        <H1 className="mt-9">Market rules</H1>
        <BoxFrame className="p-16 mt-4 text-[#6B7280] text-[24px]">
          <p>1.NFT can be purchased in the NFT market;</p>
          <p>
            2.After NFT is listed in the trading market, operations such as transfer, auction, and
            stake mining are not allowed;
          </p>
          <p>
            3.The market will charge 3% of the seller’s revenue as a service fee, of which 50% is
            burned, 40% enters the NFT Pool, and 10% is the developer’s revenue;
          </p>
        </BoxFrame>
      </form>
    </Container>
  );
};

export default NftItemSalePage;
