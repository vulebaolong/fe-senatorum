import { NEXT_PUBLIC_IS_PRODUCTION } from "@/constant/app.constant";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
    output: `standalone`,
    compiler: {
        // Xóa console.* ở production; giữ lại warn/error
        removeConsole: NEXT_PUBLIC_IS_PRODUCTION ? { exclude: ["error", "warn"] } : false,
    },
    reactStrictMode: false,
    images: {
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
                hostname: "be.tabbicus.com",
                pathname: "**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "50mb",
        },
    },
    devIndicators: false,
};

export default withNextIntl(nextConfig);
