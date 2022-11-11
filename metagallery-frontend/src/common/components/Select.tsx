import { forwardRef } from "react";
import { Control, Controller } from "react-hook-form";

type Props = {
  options: Array<{ value: string; label: string }>;
  label: string;
  placeholder?: string;
  control: Control<any, any>;
  name: string;
};

// eslint-disable-next-line react/display-name
const Select = forwardRef<HTMLSelectElement, Props>(
  ({ options, control, label, placeholder, name }, ref) => {
    return (
      <div className="space-y-7">
        <label className="text-white text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] xl:text-[24px] font-bold">
          {label}
        </label>
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <select
              ref={ref}
              placeholder={placeholder}
              className="text-[17px] px-5 py-[18px] text-white uppercase font-bold outline-none w-full text-base placeholder-gray-600 focus:shadow-outline bg-transparent border-2 border-primary"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )}
        ></Controller>
      </div>
    );
  }
);

export default Select;
