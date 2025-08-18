import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { accessToken, refreshToken } = await req.json();

    if (!accessToken || !refreshToken) {
        return NextResponse.json({ message: "Missing tokens" }, { status: 400 });
    }

    const resp = NextResponse.json({ ok: true });

    // set cookie HTTPOnly an toàn
    resp.cookies.set("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60, // 1h (tuỳ)
    });
    resp.cookies.set("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 ngày (tuỳ)
    });

    return resp;
}
