import React from "react";

export default function LineStraight({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={`w-[2px] bg-[#E2E5E9] dark:bg-[#46484B] ${className}`} {...props} />;
}
