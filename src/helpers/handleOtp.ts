import crypto from 'crypto';

export function generateOTP(): number {
  return crypto.randomInt(100000, 999999);
}
