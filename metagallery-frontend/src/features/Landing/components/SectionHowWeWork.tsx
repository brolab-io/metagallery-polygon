import BoxFrame from "../../../common/components/BoxFrame";
import Container from "../../../common/components/Container";

const howWeWorkContent = [
  {
    title: "Set up your wallet",
    description: "",
  },
  {
    title: "Create your collection",
    description: "",
  },
  {
    title: "Add your NFT's",
    description: "",
  },
  {
    title: "Sell Your NFT's",
    description: "",
  },
];

const SectionHowWeWork = () => {
  return (
    <Container className="py-[108px]">
      <div>
        <div className="text-primary uppercase text-[20px] font-bold">How we work</div>
        <div className="text-white uppercase mt-2 text-[44px] font-bold">
          CREATE YOUR OWN METAVERSE ART GALLERY
        </div>
      </div>
      <div className="grid gap-6 mt-20 sm:grid-cols-2 lg:grid-cols-4">
        {howWeWorkContent.map((item, index) => (
          <BoxFrame key={index} className="p-5 min-h-[266px] flex items-center">
            <div className="absolute -top-2">
              <div className="text-[#22B78F1A] text-[80px] font-bold">
                {(index + 1).toString().padStart(2, "0")}
              </div>
            </div>
            <h3 className="font-bold text-[24px] text-white">{item.title}</h3>
            <p className="text-[17px] text-[#B9B9BF] mt-4">{item.description}</p>
          </BoxFrame>
        ))}
      </div>
    </Container>
  );
};

export default SectionHowWeWork;
