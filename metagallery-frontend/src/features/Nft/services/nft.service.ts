import { QueryFunctionContext } from "@tanstack/react-query";
import requester from "../../../common/configs/requester";
import { PaginationResponse } from "../../../common/types/response";

type Nft = {
  tokenId: string;
  owner: string;
  createdBy: string;
  tokenURI: string;
  name: string;
  collectionId: string;
  tokenPower: string;
  createdAt: string;
  collectionInfo: {
    collectionId: string;
    collectionName: string;
    collectionOwner: string;
    collectionThemeId: string;
    collectionURIs: string;
  };
};

type MarketplaceItem = Nft & {
  marketId: string;
  marketPaymentToken: string;
  marketPrice: string;
  paymentToken: {
    tokenAddress: string;
    tokenDecimals: string;
    tokenSymbol: string;
  };
};

export const getNfts = async (
  queryContext: QueryFunctionContext
): Promise<PaginationResponse<Nft>> => {
  return requester.get("/nfts", {
    params: queryContext.queryKey[1],
  });
};

export const getMarketNfts = async (
  queryContext: QueryFunctionContext
): Promise<PaginationResponse<MarketplaceItem>> => {
  return requester.get("/marketplace", {
    params: queryContext.queryKey[1],
  });
};

export const getNft = async (queryContext: QueryFunctionContext): Promise<Nft> => {
  return requester.get(`/nfts/${queryContext.queryKey[1]}/${queryContext.queryKey[2]}`);
};

export const fetchNft = async (field: string, value: string): Promise<Nft> => {
  const url = `${process.env.LOCAL_API_URL}/nfts/${field}/${value}`;
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return null;
  });
};

export const fetchMarketNft = async (field: string, value: string): Promise<MarketplaceItem> => {
  const url = `${process.env.LOCAL_API_URL}/marketplace/${field}/${value}`;
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return null;
  });
};
