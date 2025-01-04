import { Router } from "express";
import { generateComponentCode } from "../services/ai";

const router = Router();

router.post("/component", async (req, res) => {
    try {
        const result = await generateComponentCode(req.body.input);

        res.status(200).json({ success: true, data: result });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export { router as apiRoutes };
