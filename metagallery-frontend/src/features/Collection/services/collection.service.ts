import { QueryFunctionContext } from "@tanstack/react-query";
import requester from "../../../common/configs/requester";
import { PaginationResponse } from "../../../common/types/response";

type Collection = {
  collectionId: string;
  collectionName: string;
  collectionOwner: string;
  collectionThemeId: string;
  collectionURIs: string;
  createdAt: string;
};
export const getCollections = async (
  queryContext: QueryFunctionContext
): Promise<PaginationResponse<Collection>> => {
  return requester.get("/collections", {
    params: queryContext.queryKey[1],
  });
};

export const getCollection = async (queryContext: QueryFunctionContext): Promise<Collection> => {
  const [, field, value] = queryContext.queryKey;
  return requester.get(`/collections/${field}/${value}`);
};

export const fetchCollection = async (field: string, value: string): Promise<Collection> => {
  const url = `${process.env.LOCAL_API_URL}/collections/${field}/${value}`;
  return fetch(url).then((res) => {
    if (res.ok) {
      return res.json();
    }
    return null;
  });
};
