import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import { config } from '../config/env.js';

export interface StoredFile {
  fileKey: string;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
}

export class PrivateStorageService {
  private baseStorageDir: string;

  constructor() {
    this.baseStorageDir = path.resolve(config.STORAGE_PATH, 'private_documents');
    this.ensureStorageDirectoryExists();
  }

  private ensureStorageDirectoryExists() {
    if (!fs.existsSync(this.baseStorageDir)) {
      fs.mkdirSync(this.baseStorageDir, { recursive: true });
    }
  }

  /**
   * Validates MIME types (Images: JPEG, PNG, WEBP; Documents: PDF)
   */
  validateMimeType(mimeType: string): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/pdf',
    ];
    return allowedMimeTypes.includes(mimeType.toLowerCase());
  }

  /**
   * Saves a file stream into storage (Local disk + Supabase cloud mirror if configured)
   */
  async saveFile(
    fileStream: Readable,
    originalFilename: string,
    mimeType: string
  ): Promise<StoredFile> {
    if (!this.validateMimeType(mimeType)) {
      const err = new Error('Invalid file type. Only JPEG, PNG, WEBP, and PDF documents are permitted.');
      (err as any).statusCode = 415;
      throw err;
    }

    const ext = path.extname(originalFilename).toLowerCase();
    const uniqueKey = `${crypto.randomUUID()}${ext}`;
    const targetFilePath = path.join(this.baseStorageDir, uniqueKey);

    // 1. Stream to local cache disk
    const writeStream = fs.createWriteStream(targetFilePath);
    await pipeline(fileStream, writeStream);

    const stats = fs.statSync(targetFilePath);

    // Max 5MB file check
    if (stats.size > 5 * 1024 * 1024) {
      fs.unlinkSync(targetFilePath);
      const err = new Error('File exceeds maximum size limit of 5MB');
      (err as any).statusCode = 413;
      throw err;
    }

    // 2. Mirror to Supabase Storage if credentials are provided
    if (config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const fileBuffer = fs.readFileSync(targetFilePath);
        const uploadUrl = `${config.SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/${config.SUPABASE_STORAGE_BUCKET}/${uniqueKey}`;
        
        const response = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': mimeType,
            'x-upsert': 'true',
          },
          body: fileBuffer,
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`[Supabase Storage] Mirror warning: HTTP ${response.status} - ${errText}`);
        } else {
          console.log(`[Supabase Storage] Successfully synced document ${uniqueKey} to bucket ${config.SUPABASE_STORAGE_BUCKET}`);
        }
      } catch (cloudErr) {
        console.warn('[Supabase Storage] Cloud upload error (saved locally):', cloudErr);
      }
    }

    return {
      fileKey: uniqueKey,
      originalFilename,
      mimeType,
      fileSizeBytes: stats.size,
    };
  }

  /**
   * Retrieves read stream for a stored file key (from local disk or Supabase Storage)
   */
  async getFileStreamAsync(fileKey: string): Promise<{ stream: fs.ReadStream; stats: fs.Stats }> {
    const filePath = path.join(this.baseStorageDir, fileKey);

    // Check if cached on local disk
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const stream = fs.createReadStream(filePath);
      return { stream, stats };
    }

    // If missing from local disk (e.g. Render container restart), download from Supabase Storage
    if (config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const downloadUrl = `${config.SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/authenticated/${config.SUPABASE_STORAGE_BUCKET}/${fileKey}`;
        const response = await fetch(downloadUrl, {
          headers: {
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
          },
        });

        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          fs.writeFileSync(filePath, buffer);
          const stats = fs.statSync(filePath);
          const stream = fs.createReadStream(filePath);
          return { stream, stats };
        }
      } catch (fetchErr) {
        console.error('[Supabase Storage] Error fetching remote file:', fetchErr);
      }
    }

    const err = new Error('Requested document not found in storage');
    (err as any).statusCode = 404;
    throw err;
  }

  /**
   * Synchronous fallback for legacy handlers
   */
  getFileStream(fileKey: string): { stream: fs.ReadStream; stats: fs.Stats } {
    const filePath = path.join(this.baseStorageDir, fileKey);

    if (!fs.existsSync(filePath)) {
      const err = new Error('Requested document not found in private storage');
      (err as any).statusCode = 404;
      throw err;
    }

    const stats = fs.statSync(filePath);
    const stream = fs.createReadStream(filePath);
    return { stream, stats };
  }

  /**
   * Safely deletes file from private storage & Supabase
   */
  async deleteFile(fileKey: string): Promise<void> {
    const filePath = path.join(this.baseStorageDir, fileKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    if (config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const deleteUrl = `${config.SUPABASE_URL.replace(/\/+$/, '')}/storage/v1/object/${config.SUPABASE_STORAGE_BUCKET}`;
        await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${config.SUPABASE_SERVICE_ROLE_KEY}`,
            'apikey': config.SUPABASE_SERVICE_ROLE_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prefixes: [fileKey] }),
        });
      } catch (err) {
        console.warn('[Supabase Storage] Delete error:', err);
      }
    }
  }
}

export const privateStorage = new PrivateStorageService();
