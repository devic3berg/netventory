import { Request, Response } from 'express';
import { prisma } from '../utils/db';
import { supabase } from '../utils/supabase';
import fs from 'fs/promises';
import path from 'path';

export const getAllModels = async (_: Request, res: Response) => {
  try {
    const models = await prisma.deviceModel.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(models);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};

export const createDeviceModel = async (req: Request, res: Response) => {
  try {
    console.log('=== CONTROLLER DEBUG ===');
    console.log('req.body:', req.body);
    console.log('req.body type:', typeof req.body);
    console.log('req.body keys:', req.body ? Object.keys(req.body) : 'no keys');
    console.log('req.file:', req.file);
    console.log('========================');
    
    // ✅ More defensive destructuring
    const body = req.body || {};
    const { name } = body;
    
    if (!name) {
      return res.status(400).json({ 
        error: 'Model name is required',
        receivedBody: req.body,
        bodyType: typeof req.body,
        bodyKeys: req.body ? Object.keys(req.body) : null
      });
    }

    let imageUrl: string | null = null;

    // ✅ Handle both single file and multiple field names
    let uploadedFile = req.file;
    if (!uploadedFile && req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      uploadedFile = files.image?.[0] || files.imageUrl?.[0] || files.file?.[0];
    }

    if (uploadedFile) {
      try {
        const fileBuffer = await fs.readFile(uploadedFile.path);
        const fileName = `${Date.now()}-${uploadedFile.originalname}`;

        const { data, error } = await supabase.storage
          .from('model-images')
          .upload(fileName, fileBuffer, {
            contentType: uploadedFile.mimetype,
            upsert: false,
          });

        if (error) {
          console.error('Supabase upload error:', error);
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        const { data: publicUrl } = supabase.storage
          .from('model-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl.publicUrl;

        // ✅ Clean up local file after upload
        try {
          await fs.unlink(uploadedFile.path);
        } catch (unlinkError) {
          console.warn('Failed to delete local file:', unlinkError);
        }
      } catch (fileError) {
        console.error('File processing error:', fileError);
        return res.status(500).json({ error: 'Failed to process image file' });
      }
    }

    const model = await prisma.deviceModel.create({
      data: {
        name,
        imageUrl,
      },
    });

    res.status(201).json(model);
  } catch (error) {
    console.error('Create model error:', error);
    res.status(500).json({ error: 'Failed to create device model' });
  }
};

export const deleteDeviceModel = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Model ID is required' });
    }

    // ✅ Get the model first to check if it has an image to delete
    const existingModel = await prisma.deviceModel.findUnique({
      where: { id },
    });

    if (!existingModel) {
      return res.status(404).json({ error: 'Model not found' });
    }

    // ✅ Delete image from Supabase if it exists
    if (existingModel.imageUrl) {
      try {
        const fileName = existingModel.imageUrl.split('/').pop();
        if (fileName) {
          await supabase.storage
            .from('model-images')
            .remove([fileName]);
        }
      } catch (imageDeleteError) {
        console.warn('Failed to delete image from storage:', imageDeleteError);
      }
    }

    const deleted = await prisma.deviceModel.delete({
      where: { id },
    });

    res.json(deleted);
  } catch (error) {
    console.error('Delete model error:', error);
    res.status(500).json({ error: 'Failed to delete device model' });
  }
};