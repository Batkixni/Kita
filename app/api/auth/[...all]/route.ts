import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handlers = toNextJsHandler(auth);

export const GET = async (req: Request, props: any) => {
    try {
        return await handlers.GET(req);
    } catch (error) {
        console.error("AUTH GET ERROR:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const POST = async (req: Request, props: any) => {
    try {
        const body = await req.clone().text();
        console.log("AUTH POST BODY:", body);
        return await handlers.POST(req);
    } catch (error) {
        console.error("AUTH POST ERROR:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error", details: String(error) }), { status: 500 });
    }
}
