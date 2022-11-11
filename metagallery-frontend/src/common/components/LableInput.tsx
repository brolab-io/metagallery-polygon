import clsx from "clsx";
import { forwardRef } from "react";

// Props pass by react-hook-form
type Props = {
  label: string;
  className?: string;
  error?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  disabled?: boolean;
};

// With ref forwarding by react-hook-form
// eslint-disable-next-line react/display-name
const LableInput = forwardRef<HTMLInputElement, Props>(({ className, label, ...props }, ref) => {
  return (
    <div className={clsx(className, "flex flex-col space-y-7")}>
      <label className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] font-bold">
        {label}
      </label>
      <input
        ref={ref}
        className="border-primary text-[17px] border-2 px-5 py-[18px] text-white uppercase font-bold bg-transparent outline-none"
        {...props}
      />
    </div>
  );
});

export default LableInput;
