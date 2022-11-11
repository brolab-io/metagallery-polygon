"use client";
import { Transition } from "@headlessui/react";
import { useState } from "react";
import BoxFrame from "../../../common/components/BoxFrame";
import Container from "../../../common/components/Container";

const faqContent = [
  {
    title: "What are the NFTs?",
    description:
      "A non-fungible token (NFT) is a type of digital token that represents a unique asset. These can either be entirely digital assets or tokenized versions of real-world assets. As NFTs are not interchangeable, they function as proof of authenticity and ownership within the digital realm.",
  },
  {
    title: "How do i get NFTs?",
    description:
      "Arcu morbi sit laoreet semper ultrices maecenas auctor amet. Donec tortor facilisis risus, neque sit",
  },
  {
    title: "How can we buy your NFTs?",
    description:
      "Arcu morbi sit laoreet semper ultrices maecenas auctor amet. Donec tortor facilisis risus, neque sit",
  },
  {
    title: "What is Meta Gallery Marketplace?",
    description:
      "Arcu morbi sit laoreet semper ultrices maecenas auctor amet. Donec tortor facilisis risus, neque sit",
  },
];

const SectionFAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number>(0);
  return (
    <Container className="py-[108px] flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div className="text-primary uppercase text-[20px] font-bold">FAQ</div>
        <div className="text-white uppercase mt-2 text-[44px] font-bold">Looking for answers?</div>
      </div>
      <div className="space-y-6 max-w-[740px] mt-[60px] h-[500px]">
        {faqContent.map((item, index) => (
          <BoxFrame key={index} className="p-5">
            <div className="space-y-4">
              <div onClick={() => setExpandedIndex(index)}>
                <h3 className="font-bold text-[24px] text-white">{item.title}</h3>
              </div>
              <Transition
                show={expandedIndex === index}
                enter="transition-all duration-300 overflow-hidden ease-in"
                enterFrom="h-0 opacity-0"
                enterTo="h-16 opacity-100"
                leave="transition-all duration-300 overflow-hidden ease-out"
                leaveFrom="h-16 opacity-100"
                leaveTo="h-0 opacity-0"
              >
                <p className="text-[17px] text-[#B9B9BF]">{item.description}</p>
              </Transition>
            </div>
          </BoxFrame>
        ))}
      </div>
    </Container>
  );
};

export default SectionFAQ;
