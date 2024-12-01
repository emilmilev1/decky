import express, { Request, Response } from "express";
import axios from "axios";
import prisma from "../prisma/client";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    const userId = req.user?.userId;
    const {
        search = "",
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        pageSize = 10,
    } = req.query;

    try {
        const skip =
            (parseInt(page as string) - 1) * parseInt(pageSize as string);

        const decks = await prisma.deck.findMany({
            where: {
                userId,
                OR: [
                    {
                        name: {
                            contains: search as string,
                        },
                    },
                    { description: { contains: search as string } },
                ],
            },
            orderBy: {
                [sortBy as string]: sortOrder,
            },
            skip: skip,
            take: pageSize as number,
            include: { cardsList: true },
        });

        const totalCount = await prisma.deck.count({
            where: {
                userId,
                OR: [
                    { name: { contains: search as string } },
                    { description: { contains: search as string } },
                ],
            },
        });

        res.json({ decks, totalCount });
    } catch (error) {
        console.error("Failed to fetch decks:", error);
        res.status(500).json({ error: "Failed to fetch decks" });
    }
});

router.get("/cards", async (req, res) => {
    try {
        const clashApiUrl = (process.env.CLASH_API_URL + "/cards") as string;
        const response = await axios.get(clashApiUrl, {
            headers: { Authorization: `Bearer ${process.env.CLASH_API_KEY}` },
        });
        res.status(200).json(response.data.items);
    } catch (error) {
        console.error("Error fetching cards:", error);
        res.status(500).json({ error: "Failed to fetch cards" });
    }
});

router.post(
    "/",
    authMiddleware,
    async (req: Request, res: Response): Promise<void> => {
        const { name, description, cards } = req.body;

        const userId = req.user?.userId;
        if (!userId) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }

        try {
            const deck = await prisma.deck.create({
                data: {
                    name,
                    cards,
                    userId,
                    description,
                },
            });
            console.log(deck);
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
