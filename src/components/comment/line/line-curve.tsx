import React from "react";

export default function LineCurve({ className, ...props }: React.ComponentProps<"div">) {
    return <div className={`border-l-2 border-b-2 border-[#E2E5E9] dark:border-[#46484B] border-solid rounded-bl-[15px] ${className}`} {...props} />;
}
