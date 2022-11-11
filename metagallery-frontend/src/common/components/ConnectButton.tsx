"use client";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useConnectModal, useSignMessage } from "@web3modal/react";
import { useCallback, useEffect, useRef } from "react";
import Button from "./Button";
import { requestAuthMessage } from "../services/auth.service";
import { toast } from "react-toastify";

const network = process.env.NEXT_PUBLIC_NETWORK! as unknown as any;

const ConnectButton = () => {
  const { open, isOpen } = useConnectModal();
  const isRequestingSignIn = useRef(false);
  const session = useSession();
  const { isReady, account } = useAccount();
  const isConnectedRightAccount =
    account.address.toLowerCase() === session.data?.user?.address.toLowerCase();
  const { signMessage } = useSignMessage({ message: "Connect to your account" });
  const handleConnect = useCallback(() => {
    open();
  }, [open]);

  const checkSignIn = useCallback(async () => {
    if (session.status === "loading") {
      return;
    }
    const isSignedIn = session.status === "authenticated";

    if (isSignedIn && isConnectedRightAccount) {
      return;
    }
    if (isRequestingSignIn.current) {
      return;
    }
    if (!isReady || !account.isConnected || !account.connector?.chains?.length) {
      return;
    }
    try {
      isRequestingSignIn.current = true;

      // Chain in HEX
      const chain = account.connector.chains[0].id.toString(16);
      const { message } = await requestAuthMessage({
        address: account.address,
        chain: `0x${chain}`,
        network,
      });
      const signature = await signMessage({ message });
      await signIn("credentials", { message, signature, redirect: false, callbackUrl: "/" });
    } catch (e) {
      const error = e as Error;
      console.log(error);
      toast.error(error.message);
    } finally {
      isRequestingSignIn.current = true;
      console.groupEnd();
    }
  }, [
    account.address,
    account.connector?.chains,
    account.isConnected,
    isReady,
    session.status,
    signMessage,
    isConnectedRightAccount,
  ]);

  useEffect(() => {
    checkSignIn();
  }, [checkSignIn]);

  if (session.status === "authenticated" && isConnectedRightAccount) {
    const { address } = session.data.user;
    return (
      <Button outlined>
        {address.slice(0, 6)}...{address.slice(-4)}
      </Button>
    );
  }

  if (
    session.status === "unauthenticated" ||
    (session.status === "authenticated" && !isConnectedRightAccount)
  ) {
    return (
      <Button outlined onClick={handleConnect}>
        Connect Wallet
      </Button>
    );
  }
  return (
    <Button outlined disabled onClick={handleConnect}>
      Authenticating...
    </Button>
  );
};

export default ConnectButton;
