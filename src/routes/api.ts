import { Router } from "express";
import {
    generateComponentCode,
    generateComponentCodeStream,
} from "../services/ai";
import { resolve } from "path";
import { writeFileSync } from "fs";

const router = Router();

function getFormattedDate() {
    const date = new Date();
    return date
        .toLocaleString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
        })
        .replace(/[/,]/g, "-")
        .replace(" ", "-");
}

router.get("/", (req, res) => {
    res.status(200).json({ success: true, message: "API is working!" });
});

router.get("/info", (req, res) => {
    const response = `
        <h1>API Information</h1>
        <p>Environment: ${process.env.NODE_ENV}</p>
        <p>Anthropic AI Model: ${process.env.ANTHROPIC_AI_MODEL}</p>
        <p>App URL: ${process.env.APP_URL}</p>
    `;

    res.status(200).send(response);
});

router.post("/component", async (req, res) => {
    try {
        const result = await generateComponentCode(req.body.input);

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post("/component/stream", async (req, res) => {
    let intervalId: NodeJS.Timeout | null = null;

    try {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const stream = generateComponentCodeStream(req.body.input);

        const keepAliveMessage = { type: "keep-alive" };
        intervalId = setInterval(() => res.write(`S-${JSON.stringify(keepAliveMessage)}-E\n`), 3000);

        if (process.env.NODE_ENV === "local") {
            let totalMessage = "";
            const appRoot = resolve(__dirname, "../../");
            const formattedDate = getFormattedDate();
            const fileName = `output-${formattedDate}.txt`;
            const outputFile = resolve(appRoot, `./log/${fileName}`);

            for await (const message of stream) {
                totalMessage += JSON.stringify(message, null, 2) + "\n---\n";
                writeFileSync(outputFile, totalMessage);

                res.write(`S-${JSON.stringify(message)}-E\n`);
            }
        } else {
            for await (const message of stream) {
                res.write(`S-${JSON.stringify(message)}-E\n`);
            }
        }

        clearInterval(intervalId);
        res.end();
    } catch (error: any) {
        if (intervalId) {
            clearInterval(intervalId);
        }

        res.write(
            `${JSON.stringify({ success: false, message: error.message })}\n`
        );
        res.end();
    }
});

export { router as apiRoutes };
