import Moralis from "moralis";
import { NextApiRequest, NextApiResponse } from "next";

const config = {
  domain: process.env.APP_DOMAIN!,
  statement: "Please sign this message to confirm your identity.",
  uri: process.env.NEXTAUTH_URL!,
  timeout: 60,
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { address, chain, network } = req.body;

  await Moralis.start({ apiKey: process.env.MORALIS_API_KEY });

  try {
    const payload = {
      address,
      chain,
      network,
      ...config,
    };
    const message = await Moralis.Auth.requestMessage(payload);

    res.status(200).json(message);
  } catch (e) {
    const error = e as any;
    console.log(error.details?.response?.data || error);
    const messasge = error.details?.response?.data || error.message;
    res.status(400).json({ messasge });
  }
}
