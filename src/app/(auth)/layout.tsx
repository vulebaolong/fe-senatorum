type TProps = {
    children: React.ReactNode;
};
export default function layout({ children }: TProps) {
    return <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">{children}</div>;
}
