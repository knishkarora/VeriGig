export interface SafetyScanResult {
  hasWarning: boolean;
  warnings: string[];
}

export class MessagingSafetyScanner {
  /**
   * Scans message content for safety policy violations:
   * 1. Off-platform contact sharing (Phone, WhatsApp, Telegram)
   * 2. Off-platform payment solicitation (UPI, direct transfer, GPay)
   * 3. Sensitive credentials sharing (Passwords, API secrets)
   */
  static scan(text: string): SafetyScanResult {
    const warnings: string[] = [];
    const lower = text.toLowerCase();

    // 1. Phone number or WhatsApp pattern
    const phonePattern = /(?:\+?91[\s-]?)?[6-9]\d{9}|\b(?:\+?1[\s-]?)?\d{3}[\s.-]\d{3}[\s.-]\d{4}\b/;
    const messagingHandles = /\b(?:whatsapp|wa\.me|telegram|tg|ping me at|call me at|text me on)\b/;
    if (phonePattern.test(text) || messagingHandles.test(lower)) {
      warnings.push(
        '⚠️ VeriGig Safety Advisory: Off-platform contact information (phone number/chat link) detected. Communicating off-platform forfeits payment protection, milestone escrow, and administrative dispute arbitration.'
      );
    }

    // 2. Off-platform payment patterns
    const upiPattern = /\b[\w.-]+@(?:okhdfc|okaxis|oksbi|paytm|ybl|upi|apl|axl|ibl)\b/;
    const paymentKeywords = /\b(?:pay outside|direct transfer|gpay me|phonepe me|send to my upi|cash payment|bypass escrow)\b/;
    if (upiPattern.test(lower) || paymentKeywords.test(lower)) {
      warnings.push(
        '🚨 Security Warning: Off-platform payment terms or UPI handles detected. Transacting outside the VeriGig milestone escrow system is a severe policy violation and leaves both parties vulnerable to fraud.'
      );
    }

    // 3. Email address sharing
    const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (emailPattern.test(text)) {
      warnings.push(
        'ℹ️ Privacy Notice: Email address detected. For your safety and compliance with DPDPA 2023, please keep all project-related briefs and deliverable submissions within platform workspaces.'
      );
    }

    // 4. Sensitive credential sharing
    const credentialKeywords = /(?:\bpassword\s*[:=]|\bapi[_-]?key\s*[:=]|\bsecret[_-]?key\s*[:=]|\baws_secret|\bbearer\s+[a-zA-Z0-9_\-\.]+)/;
    if (credentialKeywords.test(lower)) {
      warnings.push(
        '🔒 Credential Alert: Potential sensitive password or API key detected in message. Never share unencrypted production credentials in chat.'
      );
    }

    return {
      hasWarning: warnings.length > 0,
      warnings,
    };
  }
}
