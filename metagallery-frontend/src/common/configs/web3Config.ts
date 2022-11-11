// import type { ConfigOptions } from "@web3modal/core";

const web3Config = {
  projectId: "c0484c60a018f7fe0e6a14ca08686fcf",
  theme: "light",
  accentColor: "default",
  ethereum: {
    appName: "3D Gallery",
    chains: JSON.parse(process.env.NEXT_PUBLIC_ETHERUM_CHAINS!),
  },
} as const;

export default web3Config;
