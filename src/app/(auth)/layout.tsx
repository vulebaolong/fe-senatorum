import { cn } from "@/lib/utils";

type TProps = {
    children: React.ReactNode;
};

export default function layout({ children }: TProps) {
    return (
        <div
            className={cn(
                "relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10",
                "bg-[url('/images/bg/bg-6.webp')]",
                "bg-cover bg-center bg-no-repeat",
                // Overlay rất nhẹ chỉ để tăng contrast nhẹ
                "before:content-[''] before:absolute before:inset-0 before:pointer-events-none",
                "before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-black/20"
            )}
        >
            {children}
        </div>
    );
}
