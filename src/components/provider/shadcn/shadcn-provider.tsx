import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

export default function ShadcnProvider({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
