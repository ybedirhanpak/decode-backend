import { Router } from "express";

const router = Router();

router.post("/component", async (req, res) => {
    try {
        // TODO: Implement here
        // const result = await generateComponentCode(req.body.input);

        res.status(200).json({ success: true });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export { router as apiRoutes };
