"use client";
import { useQuery } from "@tanstack/react-query";
import { getCollections } from "../services/collection.service";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

type Props = {
  owner?: string;
  paginationEnabled?: boolean;
  limit?: number;
  orderByNewest?: 1 | -1;
};

const CollectionList: React.FC<Props> = ({ owner, orderByNewest, paginationEnabled, limit }) => {
  const filters = useMemo(() => {
    const filters: Record<string, any> = {
      limit: limit || 9,
    };
    if (orderByNewest) {
      filters["orderByCreatedAt"] = orderByNewest ? "desc" : "asc";
    }
    if (owner) {
      filters["owner"] = owner;
    }
    return filters;
  }, [limit, orderByNewest, owner]);

  const { data, isLoading, error } = useQuery(["collections", filters], getCollections);

  return (
    <div className="grid grid-cols-1 gap-8 mt-4 md:grid-cols-2 lg:grid-cols-3">
      {(data?.docs || []).map((collection, index) => (
        <Link key={collection.collectionId} href={`/collections/${collection.collectionId}`}>
          <div className="bg-[#22B78F]/10 border-2 border-primary">
            <Image
              src={`/api/imageProxy?imageUrl=https://${collection.collectionURIs}.ipfs.w3s.link/`}
              alt="Gallery"
              width={530}
              height={273}
              className="aspect-[530/273] object-cover"
            />
            <div className="flex py-8 space-x-6 px-9">
              <Image
                className="aspect-square w-[120px] h-[120px] -mt-[80px]"
                src="/assets/images/fake-avatar.jpg"
                alt="Avatar"
                width={120}
                height={120}
              />
              <span className="text-white font-bold text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] xl:text-[24px]">
                {collection.collectionName}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
export default CollectionList;
