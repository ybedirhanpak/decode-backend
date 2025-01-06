import { generateComponentCodeStream } from "../../src/services/ai";

export const config = {
    runtime: "edge"
};

export default async function handler(req: Request) {
    if (req.method === "OPTIONS") {
        return new Response(null, {
            status: 204,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            }
        });
    }

    if (req.method !== "POST") {
        return new Response("Method Not Allowed", { status: 405 });
    }

    const { input } = await req.json();

    const stream = generateComponentCodeStream(input);

    const encoder = new TextEncoder();

    const readableStream = new ReadableStream({
        async start(controller) {
            try {
                for await (const message of stream) {
                    const encodedMessage = encoder.encode(`S-${JSON.stringify(message)}-E\n`);
                    controller.enqueue(encodedMessage);
                }
            } catch (error: any) {
                controller.enqueue(encoder.encode(`${JSON.stringify({ success: false, message: error.message })}\n`));
            } finally {
                controller.close();
            }
        }
    });

    return new Response(readableStream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*"
        }
    });
}
