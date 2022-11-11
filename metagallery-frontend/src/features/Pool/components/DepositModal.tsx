import { Transition } from "@headlessui/react";
import { BigNumber, utils } from "ethers";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import BoxFrame from "../../../common/components/BoxFrame";
import Button from "../../../common/components/Button";
import LableInput from "../../../common/components/LableInput";
import useApprovedToken from "../hooks/useApprovedToken";
import useDepositToPool from "../hooks/useDepositToPool";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  poolId: BigNumber;
  callback?: () => void;
};

type FormValues = {
  amount: string;
};

const DepositModal = ({ show, setShow, poolId, callback }: Props) => {
  const { call: deposit, isLoading: isDepositting } = useDepositToPool();
  const { handleSubmit, register } = useForm<FormValues>();
  const session = useSession();

  const { approve, isApproved, isApproving, isChecking } = useApprovedToken(
    process.env.NEXT_PUBLIC_CONTRACT_TOKEN_ADDRESS!,
    process.env.NEXT_PUBLIC_CONTRACT_STAKING_ADDRESS!,
    session.data?.user.address || "",
    {
      enabled: show && !!session.data?.user.address,
    }
  );

  const onSubmit = handleSubmit(async (values) => {
    if (!isApproved) {
      await approve();
      return;
    }
    await deposit(utils.parseEther(values.amount), poolId);
    setShow(false);
    callback?.();
  });

  return (
    <Transition
      show={show}
      enter="transition-opacity duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-300"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
        <form onSubmit={onSubmit} className="bg-[#0C1226]">
          <BoxFrame className="p-8 w-[460px] max-w-[90w]">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-white">Deposit</div>
              <button disabled={isDepositting} type="button" onClick={() => setShow(false)}>
                <svg
                  className="w-6 h-6 text-white fill-current"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>
            <div className="mt-6">
              <LableInput label="Amount" {...register("amount")} />
            </div>
            <div className="mt-6">
              <Button
                type="submit"
                isLoading={isDepositting || isChecking || isApproving}
                className="w-full"
              >
                {isChecking ? "Checking..." : isApproved ? "Deposit" : "Approve"}
              </Button>
            </div>
          </BoxFrame>
        </form>
      </div>
    </Transition>
  );
};

export default DepositModal;
