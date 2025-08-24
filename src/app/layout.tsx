import Provider from "@/components/provider/Provider";
import { NEXT_PUBLIC_BASE_DOMAIN_FE, TITLE } from "@/constant/app.constant";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

const DEFAULT_DESC = "Selected articles, tutorials and knowledge sharing.";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL(NEXT_PUBLIC_BASE_DOMAIN_FE),

    title: {
        default: TITLE, // trang chủ
        template: `%s | ${TITLE}`, // trang con
    },
    description: DEFAULT_DESC,
    applicationName: TITLE,
    referrer: "origin-when-cross-origin",
    keywords: ["articles", "blog", "tech", "tutorials", "developer"],

    alternates: {
        canonical: "/", // canonical mặc định, trang con sẽ override
    },

    openGraph: {
        type: "website",
        url: "/",
        siteName: TITLE,
        title: TITLE,
        description: DEFAULT_DESC,
        images: [
            {
                url: "/og-default.jpg", // đặt ảnh 1200x630 trong public/
                width: 1200,
                height: 630,
                alt: TITLE,
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DEFAULT_DESC,
        images: ["/og-default.jpg"],
        creator: process.env.NEXT_PUBLIC_TWITTER_HANDLE, // ví dụ: "@yourhandle"
    },

    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-snippet": -1,
            "max-image-preview": "large",
            "max-video-preview": -1,
        },
    },

    icons: {
        icon: [
            { url: "/favicon.ico" },
            { url: "/icon-32.png", sizes: "32x32", type: "image/png" },
            { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
        apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },

    manifest: "/site.webmanifest", // tạo file này trong public/ nếu chưa có
    category: "technology",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#000000",
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const locale = await getLocale();
    const messages = await getMessages();

    // Schema.org WebSite + SearchAction (giúp sitelinks & ô search của Google)
    const websiteJsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: TITLE,
        url: NEXT_PUBLIC_BASE_DOMAIN_FE,
        potentialAction: {
            "@type": "SearchAction",
            target: `${NEXT_PUBLIC_BASE_DOMAIN_FE}/search?q={query}`,
            "query-input": "required name=query",
        },
    };

    return (
        <html lang={locale} suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-hidden`}>
                <NextIntlClientProvider messages={messages}>
                    <Provider>{children}</Provider>
                </NextIntlClientProvider>

                {/* Google One Tap (như bạn có) */}
                <Script src="https://accounts.google.com/gsi/client" strategy="beforeInteractive" />

                {/* JSON-LD WebSite */}
                <script
                    type="application/ld+json"
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
                />
            </body>
        </html>
    );
}

