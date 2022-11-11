/* eslint-disable @next/next/no-img-element */
"use client";

import { useRef } from "react";
import Button from "../../../common/components/Button";
import Container from "../../../common/components/Container";

const teamMembers = [
  {
    fullName: "HENRY",
    position: "Product Guy since 2018",
    avatar: "/assets/images/avatar-henry.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://twitter.com/",
      telegram: "https://t.me/",
      discord: "https://discord.com/",
    },
  },
  {
    fullName: "TRON",
    position: "Hacking tech from birth",
    avatar: "/assets/images/avatar-tron.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://twitter.com/",
      telegram: "https://t.me/",
      discord: "https://discord.com/",
    },
  },
  {
    fullName: "SHADER",
    position: "3D Modelling for 100 years",
    avatar: "/assets/images/avatar-shader.jpg",
    socials: {
      facebook: "https://www.facebook.com/",
      twitter: "https://twitter.com/",
      telegram: "https://t.me/",
      discord: "https://discord.com/",
    },
  },
];

const SectionOurTeam = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScrollLeft = () => {
    if (scrollRef.current) {
      // Scroll to left horizontally
      scrollRef.current.scrollLeft -= 200;
    }
  };

  const handleScrollRight = () => {
    if (scrollRef.current) {
      // Scroll to right horizontally
      scrollRef.current.scrollLeft += 200;
    }
  };

  return (
    <Container className="grid grid-cols-5 py-[108px] gap-x-8">
      <div className="flex flex-col col-span-2">
        <div className="h-full">
          <div className="text-primary uppercase text-[20px] font-bold">Our team</div>
          <div className="text-white uppercase mt-2 text-[44px] font-bold">Meet our TEAM</div>
          <div className="text-white uppercase mt-[60px] text-[24px] font-bold">BROLAB</div>
          <p className="text-[#B9B9BF] mt-4 text-[17px] max-w-[520px]">
            Welcome to our starship! At Brolab, we’re a crew of artist and coders, and our mission
            is to using blockchain and metaverse to create new ways to communicate accessible for
            all.
          </p>
        </div>
        <div>
          <Button className="w-12 h-12 !p-0" outlined onClick={handleScrollLeft}>
            &lt;
          </Button>
          <Button className="w-12 h-12 !p-0" outlined onClick={handleScrollRight}>
            &gt;
          </Button>
        </div>
      </div>
      <div className="col-span-3 space-y-6">
        <div
          className="flex w-full overflow-hidden space-x-[30px] snap-mandatory snap-x max-w-full"
          ref={scrollRef}
        >
          {teamMembers.map((item, index) => (
            <div
              key={index}
              className="min-w-[329px] snap-center border-2 border-primary shadow-lg bg-[#22B78F1A] p-5"
            >
              <div className="aspect-square">
                <img src={item.avatar} alt="Avatar" className="w-full aspect-square" />
              </div>
              <div className="flex flex-col py-5 space-y-1">
                <span className="text-white uppercase text-[20px]">{item.fullName}</span>
                <span className="text-[#B9B9BF]/60 uppercase text-[14px]">{item.position}</span>
              </div>
              <div className="flex space-x-3">
                <a
                  href={item.socials.twitter}
                  className="w-7 h-7 rounded-lg bg-[#14C2A3]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/images/icon-twitter.svg" alt="Twitter" />
                </a>
                <a
                  href={item.socials.facebook}
                  className="w-7 h-7 rounded-lg bg-[#14C2A3]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/images/icon-facebook.svg" alt="Facebook" />
                </a>
                <a
                  href={item.socials.telegram}
                  className="w-7 h-7 rounded-lg bg-[#14C2A3]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/images/icon-telegram.svg" alt="Telegram" />
                </a>
                <a
                  href={item.socials.discord}
                  className="w-7 h-7 rounded-lg bg-[#14C2A3]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/assets/images/icon-discord.svg" alt="Discord" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
};

export default SectionOurTeam;
