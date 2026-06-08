import { Router } from 'express';
import { User } from '../models/User.js';
import { RefreshToken } from '../models/RefreshToken.js';
import {
  getRefreshExpiry,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../utils/tokens.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const accessToken = signAccessToken(user._id.toString());
  const refreshToken = signRefreshToken(user._id.toString());

  await RefreshToken.create({
    token: hashToken(refreshToken),
    userId: user._id,
    expiresAt: getRefreshExpiry(),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.json({
    accessToken,
    user: { id: user._id, email: user.email, role: user.role },
  });
});

router.post('/refresh', async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({ message: 'Refresh token required' });
  }

  try {
    const payload = verifyRefreshToken(token);
    const stored = await RefreshToken.findOne({ token: hashToken(token), userId: payload.sub });

    if (!stored || stored.expiresAt < new Date()) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    await RefreshToken.deleteOne({ _id: stored._id });

    const accessToken = signAccessToken(payload.sub);
    const newRefreshToken = signRefreshToken(payload.sub);

    await RefreshToken.create({
      token: hashToken(newRefreshToken),
      userId: payload.sub,
      expiresAt: getRefreshExpiry(),
    });

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({ accessToken });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
});

router.post('/logout', async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (token) {
    await RefreshToken.deleteOne({ token: hashToken(token) });
  }

  res.clearCookie('refreshToken', { path: '/api/auth' });
  res.json({ message: 'Logged out' });
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const payload = verifyAccessToken(token);
    const user = await User.findById(payload.sub).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    res.json({ user: { id: user._id, email: user.email, role: user.role } });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;
