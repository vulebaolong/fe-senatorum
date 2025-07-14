"use client";

import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { useSidebar } from "../ui/sidebar";

export default function Postlist() {
    const { isMobile, open } = useSidebar();
    return (
        <div className={`grid p-4 gap-8 ${open ? "grid-cols-3" : "grid-cols-4"}`}>
            {[...Array(8)].map((_, i) => (
                <Card key={i} className="min-h-[384px] max-h-[432px] h-full">
                    <CardHeader>
                        <CardTitle>Card Title</CardTitle>
                        <CardDescription>Card Description</CardDescription>
                        <CardAction>Card Action</CardAction>
                    </CardHeader>
                    <CardContent>
                        <p>Card Content</p>
                    </CardContent>
                    <CardFooter>
                        <p>Card Footer</p>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
