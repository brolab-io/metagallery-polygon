export const getTxMessage = (error: any): string => {
  if (typeof error === "string") {
    return error;
  }
  if ("error" in error && "data" in error.error && "message" in error.error.data) {
    return error.error.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
};
