// ImagePolicyIndicator.tsx
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useMemo } from "react";
import { useImageCount } from "../hooks/useImageCount";
import { Separator } from "@/components/ui/separator";

type TProps = {
    maxSizeImage: number;
    maxImagesCount: number;
};

export default function ImagePolicyIndicator({ maxSizeImage, maxImagesCount }: TProps) {
    const count = useImageCount();
    const percent = Math.min(100, Math.round((count / maxImagesCount) * 100));
    const tone = count >= maxImagesCount ? "destructive" : count >= Math.ceil(maxImagesCount * 0.8) ? "warning" : "default";

    const acceptHuman = useMemo(() => ["JPEG/PNG (image/*)", "WebP", "GIF", "HEIC/HEIF"].join(" · "), []);

    const progressTone =
        tone === "destructive"
            ? "bg-red-100 [&>div]:bg-red-500" // track + indicator
            : tone === "warning"
            ? "bg-amber-100 [&>div]:bg-amber-500"
            : "bg-muted [&>div]:bg-primary";

    return (
        <div className={cn("flex items-center gap-3 w-fit")}>
            <div>
                <p
                    className={cn(
                        "text-muted-foreground",
                        tone === "destructive" ? "text-red-500" : tone === "warning" ? "text-amber-500" : "text-primary"
                    )}
                >
                    {count}/<span className="text-[8px] text-muted-foreground">{maxImagesCount <= 0 ? "??" : maxImagesCount} <span className="hidden sm:inline">images</span></span>
                </p>
                <Progress value={percent} className={cn("h-[1px] w-full", progressTone)} />
            </div>
            <Separator orientation="vertical" className="!w-[1px] !h-[15px]" />
            <div className="flex items-center gap-1">
                <span className="text-muted-foreground">≤ {maxSizeImage <= 0 ? "??" : maxSizeImage}MB/image</span>
                <Tooltip>
                    <TooltipTrigger className="inline-flex" aria-label="Image upload policy">
                        <Info className="h-3 w-3 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent side="bottom" align="start" className="max-w-[280px]">
                        <p className="text-xs leading-relaxed">
                            Formats: {acceptHuman}.<br />
                            Up to {maxSizeImage}MB per image. Once you reach {maxImagesCount} images, remove some to add new ones.
                        </p>
                    </TooltipContent>
                </Tooltip>
            </div>
        </div>
    );
}
