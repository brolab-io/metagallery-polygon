import BoxFrame from "../../../common/components/BoxFrame";
import Button from "../../../common/components/Button";
import Container from "../../../common/components/Container";

const SectionAbout = () => {
  return (
    <Container className="grid grid-cols-2 py-[108px] gap-8">
      <div>
        <div className="text-primary uppercase text-[20px] font-bold">About Us</div>
        <div className="text-white uppercase mt-2 text-[44px] font-bold">What is META GALLERY?</div>
        <p className="text-[#B9B9BF] mt-4 text-[17px] max-w-[520px]">
          Meta Gallery lets you build a beautiful 3D gallery to display all of your NFTs. Easily
          transfer collections in Opensea into 3D version gallery. Or minting your own NFTs with our
          marketplace.
        </p>
        <Button className="mt-[60px]" outlined>
          GET NFTS
        </Button>
      </div>
      <div className="space-y-6">
        <BoxFrame className="p-5">
          <h3 className="font-bold text-[24px] text-white">Easy to play</h3>
          <p className="text-[17px] text-[#B9B9BF] mt-4">
            Meta Gallery runs on the browser of a computer, laptop or even on a mobile browser,
            users can use it without downloading any other software or apps.
          </p>
        </BoxFrame>
        <BoxFrame className="p-5">
          <h3 className="font-bold text-[24px] text-white">Personalize</h3>
          <p className="text-[17px] text-[#B9B9BF] mt-4">
            Meta Gallery provides powerful tools to help users personalize 3d avatars and
            customize/create their own 3d galleries.
          </p>
        </BoxFrame>
        <BoxFrame className="p-5">
          <h3 className="font-bold text-[24px] text-white">Integratable</h3>
          <p className="text-[17px] text-[#B9B9BF] mt-4">
            The product structure Meta Gallery is the hubs of the microverses, making it easy to
            scale the system. We aim to be an open source project - easy to integrate with other
            systems
          </p>
        </BoxFrame>
      </div>
    </Container>
  );
};

export default SectionAbout;
