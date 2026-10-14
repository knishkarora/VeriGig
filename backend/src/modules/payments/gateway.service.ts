import crypto from 'crypto';
import { config } from '../../config/env.js';

export interface SandboxOrder {
  orderId: string;
  amount: number;
  currency: string;
  status: 'created' | 'attempted' | 'paid';
  createdAt: number;
}

export class SandboxPaymentGatewayService {
  private webhookSecret: string;

  constructor() {
    this.webhookSecret = config.JWT_SECRET || 'verigig_sandbox_secret';
  }

  /**
   * Generates a simulated marketplace order compatible with Razorpay/aggregator interfaces
   */
  createOrder(amount: number, currency: string = 'INR', receiptId: string): SandboxOrder {
    const randomHex = crypto.randomBytes(6).toString('hex');
    const orderId = `order_sand_${randomHex}`;

    return {
      orderId,
      amount,
      currency,
      status: 'created',
      createdAt: Math.floor(Date.now() / 1000),
    };
  }

  /**
   * Generates an HMAC SHA256 signature for webhooks / client verification
   */
  generateSignature(orderId: string, paymentId: string): string {
    const text = `${orderId}|${paymentId}`;
    return crypto.createHmac('sha256', this.webhookSecret).update(text).digest('hex');
  }

  /**
   * Verifies signature authenticity for webhook event payloads
   */
  verifyWebhookSignature(rawBody: string, signature?: string): boolean {
    if (!signature) {
      // In local dev/sandbox mode without strict signature header, allow sandbox mock testing token
      return config.NODE_ENV !== 'production';
    }

    try {
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(rawBody)
        .digest('hex');

      return crypto.timingSafeEqual(
        Buffer.from(signature, 'utf8'),
        Buffer.from(expectedSignature, 'utf8')
      );
    } catch {
      // If signature length mismatch or invalid format
      return false;
    }
  }
}
