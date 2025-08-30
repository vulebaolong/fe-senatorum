import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { checkPathImage } from "@/helpers/function.helper";
import { cn } from "@/lib/utils";
import { AvatarProps } from "@radix-ui/react-avatar";

type TProps = {
    name?: string | undefined;
    src?: string | undefined;
    className?: string | undefined;
} & AvatarProps;

export default function AvatartImageCustom({ className, src, name, ...props }: TProps) {
    return (
        <Avatar className={cn("w-32 h-32 rounded-full", className)} {...props}>
            <AvatarImage className="object-cover" src={checkPathImage(src) || undefined} alt={name} />
            <AvatarFallback className="rounded-lg">{(name || "").slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    );
}
