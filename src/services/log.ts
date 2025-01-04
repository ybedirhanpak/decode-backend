import Anthropic from "@anthropic-ai/sdk";
import { resolve } from "path";
import { writeFileSync } from "fs";
import { AIResult } from "../model/AI";

type ApiResponse = Anthropic.Messages.Message & {
    _request_id?: string | null;
};

const LOG_DIR = "log";

// Execute this function only in development mode
async function logResponse(response: ApiResponse) {
    // Save result to a file
    const appRoot = resolve(__dirname, "../../");
    const outputFile = resolve(
        appRoot,
        `./${LOG_DIR}/output-${Date.now().toString()}.txt`
    );

    let outputText = "Result:\n";

    outputText += JSON.stringify(response, null, 2) + "\n\n";
    outputText += "Prettified:\n";

    response.content.forEach(message => {
        if (message.type === "text") {
            outputText += "---- Text message ----\n";
            outputText += message.text + "\n";
        } else if (message.type === "tool_use") {
            outputText += "---- Tool use ----\n";
            if ((message.input as AIResult).code_react) {
                outputText += "-- React code --\n";
                outputText += (message.input as AIResult).code_react + "\n";
            }

            if ((message.input as AIResult).code_css) {
                outputText += "-- CSS code --\n";
                outputText += (message.input as AIResult).code_css + "\n";
            }
        }
    });

    // Write the output to a file
    writeFileSync(outputFile, outputText);
}

export {
    logResponse
};
