/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { notFound } from "next/navigation";
import Button from "../../../common/components/Button";
import Container from "../../../common/components/Container";
import H1 from "../../../common/components/H1";
import CollectionItemTabs from "../../../features/Collection/components/CollectionItemTabs";
import { fetchCollection } from "../../../features/Collection/services/collection.service";

type Props = {
  params: {
    id: string;
  };
};
const CollectionLayout = async ({
  children,
  params: { id: collectionId },
}: Props & { children: any }) => {
  const collection = await fetchCollection("collectionId", collectionId);
  if (!collection) {
    return notFound();
  }
  return (
    <>
      <div className="relative group">
        <div className="min-h-[60vh]">
          <Image
            src={`/api/imageProxy?imageUrl=https://${collection.collectionURIs}.ipfs.w3s.link/`}
            className="object-cover w-full"
            fill
            alt="Gallery"
          />
        </div>
        <div className="absolute inset-0 flex items-center justify-center group-hover:bg-[#0C1226BF] transition-colors duration-500">
          <Button
            href={`https://app.brolab.io/room/gallery-2?network=polygon&collection=${collection.collectionId}`}
            target="_blank"
          >
            VIEW COLLECTION IN 3D MODE
          </Button>
        </div>
        <div className="absolute -bottom-[140px] inset-x-0 pointer-events-none">
          <Container>
            <div className="flex items-end space-x-7 -mt-[140px]">
              <div className="w-[281px] h-[281px] border-2 border-primary shadow-lg bg-[#22B78F1A] p-5">
                <img src="/assets/images/fake-avatar.jpg" className="w-full h-full" alt="Avatar" />
              </div>
              <div className="flex items-center mb-8 space-x-4">
                <H1>{collection.collectionName}</H1>
                <img src="/assets/images/icon-check.svg" className="h-[26px] w-[26px]" />
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Container className="py-48">
        <CollectionItemTabs owner={collection.collectionOwner} />
        {children}
      </Container>
    </>
  );
};

export default CollectionLayout;
