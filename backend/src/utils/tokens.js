import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const accessSecret = () => process.env.JWT_ACCESS_SECRET || 'dev-access-secret';
const refreshSecret = () => process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret';

export function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, accessSecret(), {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  });
}

export function signRefreshToken(userId) {
  return jwt.sign({ sub: userId }, refreshSecret(), {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, accessSecret());
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, refreshSecret());
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function getRefreshExpiry() {
  const days = 7;
  const match = (process.env.JWT_REFRESH_EXPIRES_IN || '7d').match(/^(\d+)d$/);
  const parsedDays = match ? Number(match[1]) : days;
  return new Date(Date.now() + parsedDays * 24 * 60 * 60 * 1000);
}
