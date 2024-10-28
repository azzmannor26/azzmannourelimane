import { JWTConfigInterface } from '../interface';

export const JWT_CONFIG_CONSENTS: JWTConfigInterface = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-256-bit-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h', // 30s for 30 seconds ,15m for 15 minutes, 1h for 1 hour ,2d for 2 days
  JWT_EXPIRES_IN_SECONDS: convertTimeToSeconds(process.env.JWT_EXPIRES_IN),
};

function convertTimeToSeconds(timeString: string): number {
  if (!timeString) {
      throw new Error('Time string is undefined or empty');
  }

  const match = timeString.match(/^(\d+)([hms])$/); // Corrected regex pattern
  if (!match) {
      throw new Error('Invalid time string format');
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
      case 'h':
          return value * 3600;
      case 'm':
          return value * 60;
      case 's':
          return value;
      default:
          throw new Error('Invalid time unit');
  }
}

