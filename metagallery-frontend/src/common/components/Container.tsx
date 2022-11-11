import { PropsWithChildren } from "react";
import clsx from "clsx";

type Props = {
  className?: string;
  xxxl?: boolean;
  lg?: boolean;
};

const Container: React.FC<PropsWithChildren<Props>> = ({ children, className, xxxl, lg }) => {
  return (
    <div
      className={clsx(
        className,
        "mx-auto",
        "max-w-full px-4",
        "sm:px-5",
        "md:px-6",
        xxxl ? "lg:px-6 lg:max-w-[1784px]" : lg ? "max-w-[1186px]" : "lg:px-6 max-w-[1610px]"
      )}
    >
      {children}
    </div>
  );
};

export default Container;
