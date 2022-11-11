import NftList from "../../../../features/Nft/components/NftList";

type Props = {
  params: {
    id: string;
  };
};

const CollectionNFts = ({ params: { id: collectionId } }: Props) => {
  return <NftList collectionId={collectionId} />;
};

export default CollectionNFts;
