import Container from "../../common/components/Container";
import NftList from "../../features/Nft/components/NftList";

const MarketplacePage = () => {
  return (
    <Container className="py-10">
      <NftList isMarket />
    </Container>
  );
};

export default MarketplacePage;
