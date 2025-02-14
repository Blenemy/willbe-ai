import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  images: {
    domains: ["d1muf25xaso8hp.cloudfront.net"],
  },
};

export default withNextIntl(nextConfig);
