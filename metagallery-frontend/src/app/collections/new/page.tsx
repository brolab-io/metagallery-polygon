"use client";
import { useProvider, useSigner } from "@web3modal/react";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import BoxFrame from "../../../common/components/BoxFrame";
import BreadCrumb from "../../../common/components/Breadcrumb";
import Button from "../../../common/components/Button";
import Container from "../../../common/components/Container";
import LableInput from "../../../common/components/LableInput";
import Select from "../../../common/components/Select";
import { Contract, providers } from "ethers";
import { uploadFileToIpfs } from "../../../common/services/upload.service";
import { useRouter } from "next/navigation";

type FormValues = {
  name: string;
  files: FileList;
  galleryTheme: string;
};

const breadCrumbItems = [
  {
    href: "/collections",
    label: "My Collections",
  },
  {
    label: "Create Collection",
  },
];

const selectOptions = [
  {
    value: "1",
    label: "Theme 1",
  },
  {
    value: "2",
    label: "Theme 2",
  },
];

const CreateCollectionPage = () => {
  const { register, handleSubmit, control, watch } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>();
  const router = useRouter();

  const selectFile = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!window.ethereum) {
        return toast.error(
          "We currently only support Metamask. Please install Metamask to continue."
        );
      }
      let toastId: ReturnType<typeof toast> | null = null;
      setIsLoading(true);
      try {
        toastId = toast.info("Uploading file to IPFS...", {
          autoClose: false,
        });
        const { cid } = await uploadFileToIpfs(data.files[0]);
        // const cid = "bafkreiaf2kwce2g63o5rjvpwkcf35es3xawfbpzi63lzruoqcdslc63d7u";
        toast.update(toastId, {
          render: "Creating collection, please wait...",
        });

        const abi = ["function createCollection(string,string,uint256)"];
        // @ts-ignore
        const _provider = new providers.Web3Provider(window.ethereum);

        const contract = new Contract(
          process.env.NEXT_PUBLIC_CONTRACT_NFT_ADDRESS!,
          abi,
          _provider.getSigner()
        );
        const tx = await contract.createCollection(data.name, cid, 1);
        toast.update(toastId, {
          render: "Transaction sent, waiting for confirmation...",
        });
        await tx.wait();
        toast.update(toastId, {
          render: "Collection created successfully!",
          type: "success",
          autoClose: 3000,
        });
        router.push("/collections");
      } catch (error) {
        if (toastId) {
          toast.update(toastId, {
            render: "Something went wrong, please try again later!",
            type: "error",
            autoClose: 3000,
          });
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const { ref: fileRef, ...fields } = register("files");
  const files = watch("files");

  return (
    <Container className="py-6 sm:py-8 md:py-12 lg:py-16 xl:py-20">
      <BreadCrumb items={breadCrumbItems} />
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 text-white">
        <b className="text-[24px] mt-[29px] lg:mt-[58px]">Import Image, Video or Audio *</b>
        <span className="text-[24px] font-light">
          File types supported: JPG, PNG, GIF, SVG, MP3, WAV, MP4. Max size: 50 MB
        </span>
        <BoxFrame className="flex justify-center py-[164px] relative overflow-hidden">
          {files && files.length > 0 && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="SelectedFile"
              src={URL.createObjectURL(files[0])}
              className="absolute inset-y-0 object-contain -translate-x-1/2 left-1/2"
            />
          )}
          <div className="absolute -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
            <Button onClick={selectFile}>Upload File</Button>
          </div>
        </BoxFrame>
        <LableInput
          label="Name *"
          placeholder="Eg this is a Title"
          {...register("name", {
            required: "Name is required",
          })}
        />
        <input
          type="file"
          ref={(ref) => {
            fileRef(ref);
            fileInputRef.current = ref || undefined;
          }}
          {...fields}
          accept="image/*,video/*,audio/*"
          className="hidden"
        />
        <Select
          control={control}
          options={selectOptions}
          label="Select Gallery Theme *"
          placeholder="Select Theme"
          {...register("galleryTheme")}
        />
        <Button className="self-start" type="submit" disabled={isLoading}>
          <span className="ml-2">{isLoading ? "Creating..." : "Create New"}</span>
        </Button>
      </form>
    </Container>
  );
};

export default CreateCollectionPage;
