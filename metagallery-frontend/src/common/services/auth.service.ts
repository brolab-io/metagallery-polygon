import apiRequester from "../configs/api.requester";

type AuthMessagePayload = {
  address: string;
  chain: string;
  network: string;
};

type AuthMessageResponse = {
  message: string;
};

export const requestAuthMessage = (payload: AuthMessagePayload): Promise<AuthMessageResponse> => {
  return apiRequester.post("/api/auth/request-message", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
