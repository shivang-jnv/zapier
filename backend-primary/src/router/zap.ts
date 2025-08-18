import { Router  } from "express";
import { authMiddleware } from "../middleware";
import { ZapCreateSchema } from "../types";
import { prismaClient } from "../db";

const router = Router();

router.post("/", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const body = req.body;
    const parsedData = ZapCreateSchema.safeParse(body);

    if(!parsedData.success){
        return res.status(411).json({
            message: "Incorrect inputs"
        });
    }

    // Now we know parsedData.data exists and has the correct structure
    const { availableTriggerId, actions } = parsedData.data;

    try {
        const zapId = await prismaClient.$transaction(async tx => {
            const zap = await tx.zap.create({
                data: {
                    userId: id,
                    triggerId: "", // Temporary placeholder
                    actions: {
                        create: actions.map((x, index) => ({
                            actionId: x.availableActionId,
                            sortingOrder: index
                        }))
                    }
                }
            });

            const trigger = await tx.trigger.create({
                data: {
                    triggerId: availableTriggerId, // Now guaranteed to be string
                    zapId: zap.id
                }
            });

            await tx.zap.update({
                where: {
                    id: zap.id
                },
                data: {
                    triggerId: trigger.id
                }
            });

            return zap.id;
        });

        res.status(201).json({
            message: "Zap created successfully",
            zapId
        });
    } catch (error) {
        console.error("Error creating zap:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

router.get("/", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zaps = await prismaClient.zap.findMany({
        where: {
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    console.log("zaps handler");
    return res.json({
        zaps
    })
})

router.get("/:zapId", authMiddleware, async (req, res) => {
    //@ts-ignore
    const id = req.id;
    const zapId = req.params.zapId;
    const zap = await prismaClient.zap.findFirst({
        where: {
            id: zapId,
            userId: id
        },
        include: {
            actions: {
                include: {
                    type: true
                }
            },
            trigger: {
                include: {
                    type: true
                }
            }
        }
    })
    return res.json({
        zap
    })
})

export const zapRouter = router;