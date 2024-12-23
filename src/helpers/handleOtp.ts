import crypto from 'crypto';
import { createClient, RedisClientType } from 'redis';

export const client: RedisClientType = createClient();

client.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

// Connect Redis client on app startup
(async () => {
  if (!client.isOpen) {
    await client.connect();
    console.log('Redis client connected');
  }
})();

export function generateOTP(): number {
  return crypto.randomInt(100000, 999999);
}

export async function storeOTP(userId: string, otp: number): Promise<void> {
  const expirationTime = 300;

  try {
    await client.setEx(userId, expirationTime, otp.toString());
    console.log(`OTP for user ${userId} stored in Redis.`);
  } catch (err) {
    console.error('Error storing OTP:', err);
  }
}

export async function retrieveOTP(userId: string): Promise<string | null> {
  try {
    const otp = await client.get(userId);
    console.log(`OTP for user ${userId} retrieved: ${otp}`);
    return otp;
  } catch (err) {
    console.error('Error retrieving OTP from Redis:', err);
    return null;
  }
}

export async function disconnectRedis(): Promise<void> {
  if (client.isOpen) {
    await client.quit();
    console.log('Redis client disconnected');
  }
}
