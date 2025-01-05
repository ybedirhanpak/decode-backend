import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";

import { AIResult } from "../model/AI";
import { DesignComponent } from "../model/Design";

import { SYSTEM_PROMPT } from "./prompt";
import { logResponse } from "./log";

dotenv.config();

const MODEL = "claude-3-5-sonnet-20241022";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

const TOOL_COMPONENT_CODE = "get_component_code";

async function generateComponentCode(input: string | DesignComponent) {
    const response = await anthropic.messages.create({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: [
            {
                name: TOOL_COMPONENT_CODE,
                description: "Generate a react component code with separate react js and css modules files with the given layer data.",
                input_schema: {
                    type: "object",
                    properties: {
                        code_react: {
                            type: "string",
                            description: "The resulting react code",
                        },
                        code_css: {
                            type: "string",
                            description: "The resulting css code",
                        },
                        code_preview: {
                            type: "string",
                            description: "The resulting preview code",
                        }
                    },
                    required: ["code_react", "code_css", "code_preview"],
                },
            },
        ],
        messages: [{ role: "user", content: JSON.stringify(input) }],
    });

    const result: AIResult = {
        code_react: "",
        code_css: "",
    };

    response.content.forEach(message => {
        // This code block assumes that there is only one tool_use message
        // and that it contains zero or one code_react and code_css properties
        if (message.type === "tool_use") {
            console.log("message", message);
            if ((message.input as AIResult).code_react) {
                result.code_react = (message.input as AIResult).code_react;
            }

            if ((message.input as AIResult).code_css) {
                result.code_css = (message.input as AIResult).code_css;
            }
        }
    });

    if (process.env.NODE_ENV === "local") {
        await logResponse(response);
    }

    return result;
}

function generateComponentCodeStream(input: string | DesignComponent) {
    const stream = anthropic.messages.stream({
        model: MODEL,
        max_tokens: 4096,
        system: SYSTEM_PROMPT,
        tools: [
            {
                name: TOOL_COMPONENT_CODE,
                description: "Generate a react component code with separate react js and css modules files with the given layer data.",
                input_schema: {
                    type: "object",
                    properties: {
                        code_react: {
                            type: "string",
                            description: "The resulting react code",
                        },
                        code_css: {
                            type: "string",
                            description: "The resulting css code",
                        },
                        code_preview: {
                            type: "string",
                            description: "The resulting preview code",
                        }
                    },
                    required: ["code_react", "code_css", "code_preview"],
                },
            },
        ],
        messages: [{ role: "user", content: JSON.stringify(input) }],
    });

    return stream;
}

export {
    generateComponentCode,
    generateComponentCodeStream
};
