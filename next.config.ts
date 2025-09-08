import { NEXT_PUBLIC_IS_PRODUCTION } from "@/constant/app.constant";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: `standalone`,
    removeConsole: NEXT_PUBLIC_IS_PRODUCTION ? { exclude: ["error", "warn"] } : false,
    reactStrictMode: false,
    images: {
        domains: ["be.senatorum.com", "res.cloudinary.com"],
        remotePatterns: [
            {
                protocol: "http",
                hostname: "**",
                port: "",
                search: "",
            },
            {
                protocol: "https",
                hostname: "**",
                port: "",
                search: "",
            },
            {
                protocol: "https",
                hostname: "res.cloudinary.com",
                port: "",
                search: "",
            },
            {
                protocol: "https",
                hostname: "be.senatorum.com",
                pathname: "**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
    devIndicators: false,
};

export default withNextIntl(nextConfig);
