import Container from "../../../common/components/Container";
import H1 from "../../../common/components/H1";
import CollectionList from "../../Collection/components/CollectionList";

const SectionCollection = () => {
  return (
    <Container>
      <div className="space-y-32">
        <div className="space-y-8">
          <H1>FEATURED COLLECTION</H1>
          <CollectionList limit={3}></CollectionList>
        </div>
        <div className="space-y-8">
          <H1>NEWEST COLLECTION</H1>
          <CollectionList orderByNewest={1} limit={3}></CollectionList>
        </div>
      </div>
    </Container>
  );
};

export default SectionCollection;
