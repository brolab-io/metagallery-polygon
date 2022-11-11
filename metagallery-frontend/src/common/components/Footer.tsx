import Image from "next/image";
import Button from "./Button";
import Container from "./Container";

const Footer = () => {
  return (
    <footer className="bg-[#141A31] relative overflow-hidden">
      <Container lg>
        <div className="py-28">
          <div className="flex justify-center">
            <Image
              src="/assets/images/icon-twitter.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Twitter"
            />
            <Image
              src="/assets/images/icon-facebook.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Facebook"
            />
            <Image
              src="/assets/images/icon-telegram.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Telegram"
            />
            <Image
              src="/assets/images/icon-youtube.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Youtube"
            />
            <Image
              src="/assets/images/icon-tiktok.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Tiktok"
            />
            <Image
              src="/assets/images/icon-discord.svg"
              width={48}
              height={48}
              className="w-12 h-12"
              alt="Discord"
            />
          </div>
          <div className="text-white text-center text-[24px] sm:text-[26px] md:text-[28px] lg:text-[30px] xl:text-[32px] font-bold mt-8">
            Don’t miss out, join now for early access
          </div>
          <div className="text-[#B9B9BF] text-center text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[17px] mt-4">
            Maecenas sit pretium, cras in. In quisque sem id eget. In vel gravida ut
          </div>
          <div className="mt-12 flex justify-center space-x-5 w-full lg:max-w-[75%] mx-auto">
            <input
              placeholder="Enter your email address"
              className="border-2 w-full border-primary outline-none px-5 py-[18px] text-[#B9B9BF] bg-transparent text-[17px] h-full"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </Container>
      <div className="border-t border-t-black/50">
        <Container lg className="flex justify-between py-5">
          <div className="text-[#B9B9BF]">METAGALLERY 2022 - ALL rights reserved</div>
          <ul className="text-[#B9B9BF] space-x-4 flex">
            <li>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <a href="#">Cookies</a>
            </li>
            <li>
              <a href="#">Terms & Conditions</a>
            </li>
            <li>
              <a href="#">Contact Us</a>
            </li>
          </ul>
        </Container>
      </div>
      {/* <Image src="/assets/images/footer-2.svg" className="absolute top-0 left-20" alt="Footer 2" /> */}
      {/* <Image
        src="/assets/images/footer-1.svg"
        className="absolute right-20 bottom-14"
        alt="Footer 1"
      /> */}
    </footer>
  );
};

export default Footer;
