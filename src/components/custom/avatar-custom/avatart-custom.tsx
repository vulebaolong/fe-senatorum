import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkPathImage } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { AvatarProps } from "@radix-ui/react-avatar";
import { useRouter } from "next/navigation";

type TProps = {
    nameRouterPush?: string | undefined;
    nameFallback?: string | undefined;
    src?: string | undefined;
    className?: string | undefined;
} & AvatarProps;

export default function AvatartImageCustom({ className, src, nameRouterPush, nameFallback, ...props }: TProps) {
    const router = useRouter();

    return (
        <Avatar
            onClick={(e) => {
                e.stopPropagation();
                router.push(`/${nameRouterPush}`);
            }}
            className={cn("w-32 h-32 rounded-full", className)}
            {...props}
        >
            <AvatarImage className="object-cover" src={checkPathImage(src) || undefined} alt={nameFallback} />
            <AvatarFallback className="rounded-lg">{(nameFallback || nameRouterPush || "").slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}
