import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
};

const BoxFrame: React.FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <div className={clsx(className, "bg-[#22B78F]/10 relative")}>
      <div className="left-0 top-0 w-[22px] h-[38px] border-l-2 border-t-2 border-[##14C2A3] absolute border-primary"></div>
      <div className="right-0 top-0 w-[22px] h-[38px] border-r-2 border-t-2 border-[##14C2A3] absolute border-primary"></div>
      <div className="left-0 bottom-0 w-[22px] h-[38px] border-l-2 border-b-2 border-[##14C2A3] absolute border-primary"></div>
      <div className="right-0 bottom-0 w-[22px] h-[38px] border-r-2 border-b-2 border-[##14C2A3] absolute border-primary"></div>
      {children}
    </div>
  );
};

export default BoxFrame;
