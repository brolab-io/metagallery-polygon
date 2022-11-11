"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  params: {
    id: string;
  };
};

const CollectionItemPage = ({ params: { id: collectionId } }: Props) => {
  const router = useRouter();
  useEffect(() => {
    console.log("CollectionItemPage", router);
    if (router) {
      router.replace(`/collections/${collectionId}/nfts`);
    }
  }, [collectionId, router]);
  return null;
};

export default CollectionItemPage;
