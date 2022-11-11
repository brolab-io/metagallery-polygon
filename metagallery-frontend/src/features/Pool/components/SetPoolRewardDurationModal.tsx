import { Transition } from "@headlessui/react";
import { BigNumber, utils } from "ethers";
import { useForm } from "react-hook-form";
import BoxFrame from "../../../common/components/BoxFrame";
import Button from "../../../common/components/Button";
import LableInput from "../../../common/components/LableInput";
import useSetPoolRewardDuration from "../hooks/useSetPoolRewardDuration";

type Props = {
  show: boolean;
  setShow: (show: boolean) => void;
  poolId: BigNumber;
  callback?: () => void;
};

type FormValues = {
  duration: number;
};

const SetPoolRewardDurationModal = ({ show, setShow, poolId, callback }: Props) => {
  const { call: deposit, isLoading: isSetting } = useSetPoolRewardDuration();
  const { handleSubmit, register } = useForm<FormValues>();

  const onSubmit = handleSubmit(async (values) => {
    console.log(`Setting pool reward duration ${values.duration} to pool ${poolId}`);
    await deposit(values.duration + "", poolId);
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
              <div className="text-2xl font-bold text-white">Set Duration</div>
              <button type="button" disabled={isSetting} onClick={() => setShow(false)}>
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
              <LableInput label="Duration" {...register("duration")} />
            </div>
            <div className="mt-6">
              <Button type="submit" isLoading={isSetting} className="w-full">
                Set Reward Duration
              </Button>
            </div>
          </BoxFrame>
        </form>
      </div>
    </Transition>
  );
};

export default SetPoolRewardDurationModal;
