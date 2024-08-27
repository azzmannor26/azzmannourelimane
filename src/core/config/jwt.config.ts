import { JWTConfigInterface } from '../interface';

export const JWT_CONFIG_CONSENTS: JWTConfigInterface = {
  JWT_SECRET: process.env.JWT_SECRET || 'your-256-bit-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h', // 30s for 30 seconds ,15m for 15 minutes, 1h for 1 hour ,2d for 2 days
  JWT_EXPIRES_IN_SECONDS: convertTimeToSeconds(process.env.JWT_EXPIRES_IN),
};

function convertTimeToSeconds(timeString: string): number {
  const timeUnits: { [key: string]: number } = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
  };

  const regex = /(\d+)([smhd])/;
  const match = regex.exec(timeString);
  if (!match) {
    throw new Error('Invalid time string format');
  }

  const value = parseInt(match[1]);
  const unit = match[2];

  if (!timeUnits[unit]) {
    throw new Error('Invalid time unit');
  }

  return value * timeUnits[unit];
}
