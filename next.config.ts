import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ["d1muf25xaso8hp.cloudfront.net"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
      },
      {
        protocol: "https",
        hostname: "thecompaniesapi.s3.fr-par.scw.cloud",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
