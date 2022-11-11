import { QueryFunctionContext } from "@tanstack/react-query";
import requester from "../../../../common/configs/requester";
import { PaginationResponse } from "../../../../common/types/response";

type PaymentToken = {
  tokenAddress: string;
  tokenSymbol: string;
  tokenDecimals: string;
};
export const getPaymentTokens = async (
  queryContext: QueryFunctionContext
): Promise<PaginationResponse<PaymentToken>> => {
  return requester.get("/payment-tokens", {
    params: queryContext.queryKey[1],
  });
};
