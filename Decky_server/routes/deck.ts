import express, { Request, Response } from "express";
import prisma from "../prisma/client";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user?.userId;

    try {
        const decks = await prisma.deck.findMany({ where: { userId } });
        res.json(decks);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch decks" });
    }
});

router.post(
    "/",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const { name, cards } = req.body;

        const userId = req.user?.userId;
        if (!userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        try {
            const deck = await prisma.deck.create({
                data: { name, cards, userId },
            });
            res.status(201).json(deck);
        } catch (error) {
            res.status(500).json({ error: "Failed to create deck" });
        }
    }
);

router.put(
    "/:id",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        const { name, cards } = req.body;

        try {
            const deck = await prisma.deck.update({
                where: { id: Number(id) },
                data: { name, cards },
            });
            res.json(deck);
        } catch (error) {
            res.status(500).json({ error: "Failed to update deck" });
        }
    }
);

router.delete("/:id", authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.deck.delete({ where: { id: Number(id) } });
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ error: "Failed to delete deck" });
    }
});

export default router;
