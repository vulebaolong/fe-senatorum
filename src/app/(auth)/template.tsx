import { ROUTER_CLIENT } from "@/constant/router.constant";
import { getAccessToken } from "@/helpers/cookies.helper";
import Template from "@/template/template";
import { redirect } from "next/navigation";

export default async function template({ children }: { children: React.ReactNode }) {
    const accessToken = await getAccessToken();
    if (accessToken) return redirect(ROUTER_CLIENT.HOME);
    return <Template>{children}</Template>;
}
