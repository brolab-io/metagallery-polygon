import clsx from "clsx";
import { PropsWithChildren } from "react";

type Props = {
  className?: string;
};

const H1: React.FC<PropsWithChildren<Props>> = ({ children, className }) => {
  return (
    <h1
      className={clsx(
        "text-[24px] sm:text-[28px] md:text-[36px] lg:text-[48px] font-bold uppercase text-white",
        className
      )}
    >
      {children}
    </h1>
  );
};

export default H1;
