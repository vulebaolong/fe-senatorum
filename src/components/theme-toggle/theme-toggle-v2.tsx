"use client";
import { MonitorCog, Moon, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";

export default function ThemeToggleV2() {
    const { setTheme, theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted)
        return (
            <div className="flex gap-1 rounded-12 border border-border-subtlest-tertiary p-1">
                <Button type="button" variant="ghost">
                    <Moon />
                </Button>
                <Button type="button" variant="ghost">
                    <SunDim size={30} />
                </Button>
                <Button type="button" variant="ghost">
                    <MonitorCog />
                </Button>
            </div>
        );

    return (
        <div className="flex items-center gap-1 rounded-[12px] border border-border-subtlest-tertiary p-1">
            <Button type="button" className="size-6" onClick={() => setTheme("dark")} variant="ghost">
                <Moon fill={theme === "dark" ? "var(--primary)" : "var(--primary-foreground)"} />
            </Button>
            <Button type="button" className="size-6" onClick={() => setTheme("light")} variant="ghost">
                <SunDim size={30} fill={theme === "light" ? "var(--primary)" : "var(--primary-foreground)"} />
            </Button>
            <Button type="button" className="size-6" onClick={() => setTheme("system")} variant="ghost">
                <MonitorCog fill={theme === "system" ? "var(--primary)" : "var(--primary-foreground)"} />
            </Button>
        </div>
    );
}
