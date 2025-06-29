import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { prisma } from '../utils/db';
import { supabase } from '../utils/supabase';
import fs from 'fs/promises';

export const createRequest = async (req: AuthRequest, res: Response) => {
  const { type, reason, deviceId, quantity, replacementRequested } = req.body;

  if (!['REPAIR', 'REPLACEMENT', 'ORDER'].includes(type)) {
    return res.status(400).json({ error: 'Invalid request type' });
  }

  if (!reason) {
    return res.status(400).json({ error: 'Reason is required' });
  }

  if (type !== 'ORDER' && !deviceId) {
    return res.status(400).json({ error: 'Device ID is required for REPAIR and REPLACEMENT' });
  }

  if (type === 'ORDER' && (!quantity || quantity < 1)) {
    return res.status(400).json({ error: 'Quantity must be at least 1 for ORDER requests' });
  }

  let attachmentUrl: string | null = null;

  if (req.file) {
    const fileBuffer = await fs.readFile(req.file.path);
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const { data, error } = await supabase.storage
      .from('attachments')
      .upload(fileName, fileBuffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (error) return res.status(500).json({ error: 'Failed to upload file' });

    const { data: publicUrl } = supabase.storage
      .from('attachments')
      .getPublicUrl(fileName);

    attachmentUrl = publicUrl.publicUrl;
  }

  const newRequest = await prisma.request.create({
    data: {
      type,
      reason,
      status: 'NEW',
      quantity,
      attachmentUrl,
      deviceId: type !== 'ORDER' ? deviceId : null,
      userId: req.user!.id,
      replacementRequested: replacementRequested === 'true', // 👈 здесь сохраняем как true/false
    },
  });

  res.status(201).json(newRequest);
};

export const getRequests = async (req: AuthRequest, res: Response) => {
  const isAdmin = req.user?.role === 'ADMIN';

  const requests = await prisma.request.findMany({
    where: isAdmin ? {} : { userId: req.user?.id },
    orderBy: { createdAt: 'desc' },
    include: {
      device: {
        include: { model: true },
      },
    },
  });

  res.json(requests);
};

export const getRequestById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  const request = await prisma.request.findUnique({
    where: { id },
    include: {
      user: true,
      device: {
        include: { model: true },
      },
    },
  });

  if (!request) {
    return res.status(404).json({ error: 'Request not found' });
  }

  res.json(request);
};

export const updateRequest = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, adminComment, newSerialNumber } = req.body;

  const updated = await prisma.request.update({
    where: { id },
    data: {
      status,
      adminComment,
      newSerialNumber,
    },
  });

  res.json(updated);
};
