export const NEXT_PUBLIC_IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";

export const MOBILE_VISIBLE_DESKTOP_HIDDEN = `mantine-hidden-from-md`;
export const MOBILE_HIDDEN_DESKTOP_VISIBLE = `mantine-visible-from-md`;
export const ACCESS_TOKEN = "accessToken";
export const REFRESH_TOKEN = "refreshToken";
export const NEXT_LOCALE = "NEXT_LOCALE";
export const COLOR_KEYS = "user-color-theme";

export const NEXT_PUBLIC_BASE_DOMAIN_BE = process.env.NEXT_PUBLIC_BASE_DOMAIN_BE || "http://localhost:3069";
export const NEXT_PUBLIC_BASE_DOMAIN_FE = process.env.NEXT_PUBLIC_BASE_DOMAIN_FE || "http://localhost:3000";

export const NEXT_PUBLIC_BASE_DOMAIN_BE_API = `${NEXT_PUBLIC_BASE_DOMAIN_BE}/api`;

export const NEXT_PUBLIC_GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY = process.env.NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY;
export const FOLDER_IMAGE_BE = `/public/images`;

export const TITLE = `Senatorum`;
export const LOGO = `/base-1024.png`;
export const FALLBACK_IMAGE = "/images/fallback-image.png";

export const VERSION = "1.0.5";

console.log({
    NEXT_PUBLIC_IS_PRODUCTION,
    NEXT_PUBLIC_BASE_DOMAIN_BE,
    NEXT_PUBLIC_BASE_DOMAIN_BE_API,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY,
});

