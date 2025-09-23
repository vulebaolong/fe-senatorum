// components/container.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

type AsProp<E extends React.ElementType> = {
    as?: E;
};

type ContainerProps<E extends React.ElementType = "div"> = AsProp<E> &
    Omit<React.ComponentPropsWithoutRef<E>, "as" | "className"> & {
        className?: string;
    };

// forwardRef + generic để giữ đúng type của element được chọn
export const Container = React.forwardRef(function Container<E extends React.ElementType = "div">(
    { as, className, ...props }: ContainerProps<E>,
    ref: React.ComponentRef<E> extends never ? never : React.Ref<any>
) {
    const Comp = (as ?? "div") as React.ElementType;
    return <Comp ref={ref} className={cn("container mx-auto px-4 sm:px-10 lg:px-20", className)} {...(props as object)} />;
}) as <E extends React.ElementType = "div">(props: ContainerProps<E> & { ref?: React.ComponentRef<E> }) => React.ReactElement | null;
