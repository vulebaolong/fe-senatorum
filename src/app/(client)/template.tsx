import Template from "@/template/template";

export default async function template({ children }: { children: React.ReactNode }) {
    return <Template>{children}</Template>;
}
