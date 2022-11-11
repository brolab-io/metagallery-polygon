import Link from "next/link";
import H1 from "./H1";

type BreadCrumbItem = {
  href?: string;
  label: string;
};

type Props = {
  items: BreadCrumbItem[];
};

const BreadCrumb: React.FC<Props> = ({ items }) => {
  const title = items[items.length - 1].label;
  const firstItem = items.length > 1 ? items[0] : null;
  return (
    <>
      {firstItem && (
        <div className="flex items-center mb-7">
          {
            <Link href={firstItem.href!}>
              <span className="text-white text-[20px] sm:text-[24] md:text-[28px] lg:text-[32px] font-bold">
                &lt; {firstItem.label}
              </span>
            </Link>
          }
        </div>
      )}
      <H1>{title}</H1>
    </>
  );
};

export default BreadCrumb;
