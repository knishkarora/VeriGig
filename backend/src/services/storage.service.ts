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
   * Saves a file stream into private storage with a collision-resistant unique key
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

    // Stream to private disk
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

    return {
      fileKey: uniqueKey,
      originalFilename,
      mimeType,
      fileSizeBytes: stats.size,
    };
  }

  /**
   * Retrieves read stream for a stored file key
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
   * Safely deletes file from private storage
   */
  async deleteFile(fileKey: string): Promise<void> {
    const filePath = path.join(this.baseStorageDir, fileKey);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
}

export const privateStorage = new PrivateStorageService();
