"use client";
import { useSearchParams } from "next/navigation";
import BreadCrumb from "../../common/components/Breadcrumb";
import Button from "../../common/components/Button";
import Container from "../../common/components/Container";
import CollectionList from "../../features/Collection/components/CollectionList";

const breadCrumbItems = [
  {
    href: "/collections",
    label: "Collections",
  },
];

const CollectionsPage = () => {
  const searchParams = useSearchParams();
  const onwer = searchParams.get("owner");
  return (
    <>
      <Container className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
        <div className="flex items-center justify-between mb-[61px]">
          <BreadCrumb items={breadCrumbItems} />
          <Button href="/collections/new">Create New</Button>
        </div>
        <CollectionList owner={onwer || undefined} />
      </Container>
    </>
  );
};

export default CollectionsPage;
