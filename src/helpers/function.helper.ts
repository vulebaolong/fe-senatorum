import { FOLDER_IMAGE_BE, NEXT_PUBLIC_BASE_DOMAIN_BE, NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import dayjs from "dayjs";

export const checkPathImage = (path: string | null | undefined) => {
    if (!path) return path;
    if (path.includes(`http`)) {
        return path;
    }

    if (path.includes(`local`)) {
        return `${NEXT_PUBLIC_BASE_DOMAIN_BE}${FOLDER_IMAGE_BE}/${path}`;
    } else {
        return `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${path}`;
    }
};

export const resError = (error: any, defaultMes: string) => {
    const mes = error?.response?.data?.message;

    if (Array.isArray(mes)) return mes[0];

    if (error?.message) return error?.message;

    return defaultMes;
};

export const formatLocalTime = (time?: dayjs.ConfigType, format = "HH:mm:ss DD/MM/YYYY") => {
    if (typeof time === "string") {
        if (format === `ago`) return dayjs(time).fromNow();
        return dayjs.utc(time).local().format(format);
    } else if (typeof time === "number") {
        if (format === `ago`) return dayjs.unix(time).local().fromNow();
        return dayjs.unix(time).local().format(format);
    } else {
        if (format === `ago`) return dayjs().local().fromNow();
        return dayjs().local().format(format);
    }
};

export function formatRelativeTimeNumber(time: dayjs.ConfigType) {
    const now = dayjs();
    const d = dayjs(time);

    const diffSeconds = now.diff(d, "second");
    if (diffSeconds < 60) return `${diffSeconds} giây`;

    const diffMinutes = now.diff(d, "minute");
    if (diffMinutes < 60) return `${diffMinutes} phút`;

    const diffHours = now.diff(d, "hour");
    if (diffHours < 24) return `${diffHours} giờ`;

    const diffDays = now.diff(d, "day");
    return `${diffDays} ngày`;
}

export function moveElementToTop<T>(arr: T[], condition: (item: T) => boolean): T[] {
    const matched = arr.filter(condition); // Lấy phần tử thỏa mãn điều kiện
    const others = arr.filter((item) => !condition(item)); // Lấy phần tử không thỏa mãn
    return matched.concat(others); // Ghép lại, đảm bảo phần tử thỏa mãn lên đầu
}

export class LogWithColor {
    private bufferedSegments: { text: string; style: string }[] = [];
    private lineMode = false;

    // ✉️ Gọi mes: nếu chưa bật .line(), log ngay; nếu đã bật .line(), lưu lại
    mes(message: string | object, style: Partial<CSSStyleDeclaration> = {}) {
        const text = typeof message === "object" ? JSON.stringify(message, null, 2) : message;

        const styleStr = this.buildStyleString(style);

        if (this.lineMode) {
            this.bufferedSegments.push({ text, style: styleStr });
        } else {
            console.log(`%c${text}`, styleStr);
        }

        return this;
    }

    // 📌 Gọi line: in ra tất cả những gì đã mes() trước đó
    eln() {
        if (this.bufferedSegments.length === 0) return;

        const format = this.bufferedSegments.map(() => "%c%s").join(" ");
        const args: any[] = [];

        this.bufferedSegments.forEach((seg) => {
            args.push(seg.style, seg.text);
        });

        console.log(format, ...args);

        // reset trạng thái
        this.bufferedSegments = [];
        this.lineMode = false;

        return this;
    }

    // 🚀 Bật chế độ line
    sln() {
        this.lineMode = true;
        return this;
    }

    // 🧰 Helper: build style string
    private buildStyleString(style: Partial<CSSStyleDeclaration>): string {
        return (
            Object.entries(style)
                .map(([key, value]) => `${this.camelToKebab(key)}: ${value};`)
                .join(" ") || "font-weight: bold;"
        );
    }

    private camelToKebab(str: string) {
        return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
    }
}

// ✅ Khởi tạo instance
export const logWithColor = new LogWithColor();

// export function buildInitialValues(fields: TFieldCreate[]) {
//     return fields.reduce((acc, field) => {
//         if (field.type === "number") {
//             acc[field.name] = 0;
//         } else if (field.type === "tags") {
//             acc[field.name] = [];
//         } else if (field.type === "select" && field.dataTags?.some((item: any) => item.value === "true" || item.value === "false")) {
//             acc[field.name] = false;
//         } else {
//             acc[field.name] = "";
//         }
//         return acc;
//     }, {} as Record<string, any>);
// }

// export function buildValidationSchema(fields: TFieldCreate[]) {
//     const shape: Record<string, any> = {};

//     fields.forEach((field) => {
//         let validator: any = null;

//         switch (field.type) {
//             case "text":
//                 validator = Yup.string();
//                 break;
//             case "number":
//                 validator = Yup.number();
//                 break;
//             case "select":
//                 validator = Yup.string();
//                 break;
//             case "date":
//                 validator = Yup.date();
//                 break;
//             default:
//                 validator = Yup.mixed();
//         }

//         if (field.withAsterisk) {
//             validator = validator.required(`${field.label} is required`);
//         }

//         if (field.validate) {
//             // Nếu có custom validate → apply
//             validator = field.validate(Yup, validator);
//         }

//         shape[field.name] = validator;
//     });

//     return Yup.object().shape(shape);
// }

export function animationList(rowIndex: number) {
    return {
        opacity: "0",
        animation: "fadeInUp 0.5s forwards",
        animationDelay: `${50 * rowIndex}ms`,
    };
}

export const wait = (miliseconds: number) => {
    return new Promise(function (resolve) {
        setTimeout(resolve, miliseconds);
    });
};

export function multiRAF(callback: () => void, count = 3) {
    const raf = () => {
        if (count <= 0) {
            callback();
        } else {
            requestAnimationFrame(() => multiRAF(callback, count - 1));
        }
    };
    raf();
}

export function hexToRgba(hex: string, alpha: number) {
    const sanitized = hex.replace("#", "");
    const bigint = parseInt(sanitized, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function toUrl(publicId: string) {
    return `${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${publicId}`;
}

/**
 *  ví dụ:
 * - formatCompactIntl(999); // "999"
 * - formatCompactIntl(1000); // "1k"
 * - formatCompactIntl(2100); // "2.1k"
 * - formatCompactIntl(2_150_000); // "2.1M"
 */
export function formatCompactIntl(
    n: number | null | undefined,
    {
        digits = 1,
        locale = "en", // dùng "en" để ra K/M/B; "vi-VN" có thể ra dạng khác
        lowerCaseK = true,
    }: { digits?: number; locale?: string; lowerCaseK?: boolean } = {}
): string {
    if (n == null || Number.isNaN(+n)) return "0";
    const fmt = new Intl.NumberFormat(locale, {
        notation: "compact",
        compactDisplay: "short",
        maximumFractionDigits: digits,
    });
    let s = fmt.format(n);
    // bỏ .0 thừa (vd 2.0K -> 2K) và chuyển K -> k nếu muốn
    s = s.replace(/([.,])0\b/g, "");
    if (lowerCaseK) s = s.replace(/K/g, "k");
    return s;
}

export function removeEventListener(socket: any, eventName: string, callback?: (...args: any[]) => void) {
   if (callback) {
      socket?.off(eventName, callback);
   } else {
      socket?.off(eventName);
   }
   logWithColor.sln().mes("🔴 REMOVED - ", { color: "red" }).mes(eventName, { color: "cyan", fontWeight: "bold" }).eln();
}

export function emitToEvent(socket: any, eventName: string, payload: any, cb?: (data: any) => void) {
   socket?.emit(eventName, payload, cb);
   logWithColor
      .sln()
      .mes("🔵 EMIT - ", { color: "blue" })
      .mes(eventName, { color: "cyan", fontWeight: "bold" })
      .mes(payload, { color: "gray", fontSize: "12px" })
      .eln();
}