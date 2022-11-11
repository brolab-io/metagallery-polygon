"use client";
import { Web3Modal } from "@web3modal/react";
import web3Config from "../configs/web3Config";

const Web3Provider: React.FC = () => {
  return <Web3Modal config={web3Config}></Web3Modal>;
};

export default Web3Provider;
