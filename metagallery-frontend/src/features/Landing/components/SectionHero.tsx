import Button from "../../../common/components/Button";
import Container from "../../../common/components/Container";

const SectionHero = () => {
  return (
    <div className="min-h-[calc(100vh-108px)] bg-[url(/assets/images/section.jpg)] relative">
      <div className="absolute inset-0">
        <Container className="relative flex h-full">
          <div className="flex flex-col justify-center">
            <h1 className="uppercase font-bold text-primary text-[80px]">META GALLERY</h1>{" "}
            <h2 className="uppercase font-bold text-white text-[80px] -mt-6">
              DISPLAY NFTS IN METAVERSE
            </h2>
            <div className="mt-8 space-x-5">
              <Button>Connect Wallet</Button>
              <Button outlined>EXPLORE</Button>
            </div>
          </div>
        </Container>
        <div className="absolute bottom-0 right-0 ">
          <img src="/assets/images/hero.png" className="w-[728px]" alt="hero" />
        </div>
      </div>
    </div>
  );
};

export default SectionHero;
