// useHashScrollWithin.tsx
import { useCallback, useEffect } from "react";

// CSS.escape polyfill đơn giản (tránh crash nếu id có ký tự lạ)
const cssEscape = (sel: string) =>
    (window as any).CSS?.escape ? (window as any).CSS.escape(sel) : sel.replace(/([ #.;?%&,+*~':"!^$[\]()=>|/@])/g, "\\$1");

export function useHashScrollWithin(scrollerRef: React.RefObject<HTMLElement | null>) {
    const scrollToHash = useCallback(
        (hash?: string) => {
            const scroller = scrollerRef.current;
            if (!scroller) return;

            const raw = (hash ?? window.location.hash).replace(/^#/, "");
            if (!raw) return;

            const el = scroller.querySelector<HTMLElement>(`#${cssEscape(decodeURIComponent(raw))}`);
            if (!el) return;

            // Smooth scroll phần tử đó vào trong scroller gần nhất
            el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
        },
        [scrollerRef]
    );

    useEffect(() => {
        // Auto cuộn khi trang load có hash
        scrollToHash();
        // Lắng nghe thay đổi hash (khi dùng router.push('#id') / Link href="#id")
        const onHash = () => scrollToHash();
        window.addEventListener("hashchange", onHash, { passive: true });
        return () => window.removeEventListener("hashchange", onHash);
    }, [scrollToHash]);

    return { scrollToHash };
}
