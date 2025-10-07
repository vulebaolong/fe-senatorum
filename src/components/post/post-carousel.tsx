"use client";

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY } from "@/constant/app.constant";
import { TArticle } from "@/types/article.type";
import { useCallback, useEffect, useState } from "react";
import ImageCustom from "../custom/image-custom/ImageCustom";
import { cn } from "@/lib/utils";

type TProps = {
    imageUrls: TArticle["imageUrls"];
};

export function PostCarousel({ imageUrls }: TProps) {
    const [api, setApi] = useState<CarouselApi>();
    const [idx, setIdx] = useState(0); // 0-based
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) return;
        setCount(api.scrollSnapList().length);
        setIdx(api.selectedScrollSnap());
        api.on("select", () => setIdx(api.selectedScrollSnap()));
    }, [api]);

    const goTo = useCallback(
        (i: number) => {
            if (!api) return;
            api.scrollTo(i);
        },
        [api]
    );

    const images = imageUrls ?? [];

    return (
        <div className="mx-auto w-full max-w-[720px]">
            <div className="relative group rounded-md overflow-hidden bg-black">
                {/* Gradient edges (IG-like) */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/50 to-transparent" />

                <Carousel setApi={setApi} className="w-full" opts={{ align: "start", loop: false }}>
                    <CarouselContent className="m-0">
                        {images.map((imageString, i) => (
                            <CarouselItem key={i} className="basis-full p-0">
                                <div className="relative w-full aspect-[4/3] sm:aspect-[16/10]">
                                    <ImageCustom
                                        src={`${NEXT_PUBLIC_BASE_DOMAIN_CLOUDINARY}/${imageString}`}
                                        alt="article image"
                                        className="absolute inset-0 h-full w-full object-cover select-none"
                                    />
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* Prev/Next: tròn, mờ, đè lên ảnh */}
                    {/* <CarouselPrevious
                        className={cn(
                            "absolute left-3 top-1/2 -translate-y-1/2 z-20",
                            "h-10 w-10 rounded-full border-0",
                            "bg-black/40 backdrop-blur-sm",
                            "text-white hover:bg-black/60 hover:text-white",
                            "shadow-md",
                            "transition"
                        )}
                    />
                    <CarouselNext
                        className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 z-20",
                            "h-10 w-10 rounded-full border-0",
                            "bg-black/40 backdrop-blur-sm",
                            "text-white hover:bg-black/60 hover:text-white",
                            "shadow-md",
                            "transition"
                        )}
                    /> */}
                </Carousel>

                {/* Dot pagination: đáy, giữa, đè lên ảnh */}
                {count > 1 && (
                    <div
                        className={cn(
                            "absolute bottom-5 left-1/2 -translate-x-1/2 z-20",
                            "flex items-center justify-center",
                            "w-min rounded-full border-0 overflow-hidden",
                            "p-1 sm:p-2 bg-black/40 backdrop-blur-sm text-white shadow-md transition"
                        )}
                    >
                        {Array.from({ length: count }).map((_, i) => {
                            const active = i === idx;
                            return (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => goTo(i)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault();
                                            goTo(i);
                                        }
                                    }}
                                    aria-label={`Go to slide ${i + 1}`}
                                    aria-current={active ? "true" : undefined}
                                    className={cn(
                                        // hit area lớn cho mobile
                                        "grid place-items-center rounded-full outline-none",
                                        "p-1 sm:p-1.5 focus-visible:ring-2 focus-visible:ring-white/70"
                                    )}
                                >
                                    <span
                                        className={cn(
                                            "block rounded-full transition-all",
                                            // kích thước chấm (mobile nhỏ hơn, lên sm lớn hơn)
                                            active
                                                ? "w-[6px] h-[6px] sm:w-2 sm:h-2 bg-white"
                                                : "w-[5px] h-[5px] sm:w-1.5 sm:h-1.5 bg-white/50 hover:bg-white/70"
                                        )}
                                    />
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
