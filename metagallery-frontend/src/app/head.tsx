import { NextSeo } from "next-seo";

import { NEXT_SEO_DEFAULT } from "../../next-seo.config"; // your path will vary

export default async function Head() {
  return <NextSeo {...NEXT_SEO_DEFAULT} useAppDir={true} />;
}
