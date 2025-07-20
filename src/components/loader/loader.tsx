import { Loader2 } from "lucide-react";
import type { ComponentProps } from "react";

export default function Loader(props: ComponentProps<typeof Loader2>) {
    return <Loader2 className="h-5 w-5 animate-spin" {...props} />;
}
