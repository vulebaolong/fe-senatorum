import { cn } from "@/lib/utils";

type TProps = {
    children: React.ReactNode;
};

export default function layout({ children }: TProps) {
    return (
        <div
            className={cn(
                "relative flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10",
                "bg-[url('/images/bg/bg-3.webp')]",
                "bg-cover bg-center bg-no-repeat",
                // Overlay rất nhẹ chỉ để tăng contrast nhẹ
                "before:content-[''] before:absolute before:inset-0 before:pointer-events-none",
                "before:bg-gradient-to-b before:from-transparent before:via-black/10 before:to-black/20"
            )}
        >
            {/* Container hòa hợp với hình nền */}
            <div className="relative z-10 w-full max-w-sm">
                <div className="relative p-6 rounded-3xl bg-black/10 border border-white/20 shadow-lg">
                    {/* Lớp gradient nhẹ để tăng độ tương phản cho text */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-black/10 rounded-xl pointer-events-none" />
                    <div className="relative">{children}</div>
                </div>
            </div>
        </div>
    );
}
