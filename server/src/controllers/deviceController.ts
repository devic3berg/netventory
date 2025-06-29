import { Response } from 'express';
import { prisma } from '../utils/db';
import { AuthRequest } from '../middleware/auth';

export const getDevices = async (req: AuthRequest, res: Response) => {
  try {
    const { modelId } = req.query;

    if (req.user?.role === 'ADMIN') {
      const devices = await prisma.device.findMany({
        where: modelId ? { modelId: modelId as string } : undefined,
        include: {
          model: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });
      return res.json(devices);
    }

    const devices = await prisma.device.findMany({
      where: {
        userId: req.user?.id,
        ...(modelId ? { modelId: modelId as string } : {}),
      },
      include: { model: true },
    });

    res.json(devices);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch devices' });
  }
};


export const createDevice = async (req: AuthRequest, res: Response) => {
  const { serialNumber, modelId, userId } = req.body;

  if (!serialNumber || !modelId || !userId) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const device = await prisma.device.create({
      data: {
        serialNumber,
        modelId,
        userId,
      },
    });

    res.status(201).json(device);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create device' });
  }
};
