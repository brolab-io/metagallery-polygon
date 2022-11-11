import axios from "axios";

type UploadResponse = {
  cid: string;
};

export const uploadFileToIpfs = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("file", file);

  return axios.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY!,
    },
    baseURL: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_URL!,
  });
};
