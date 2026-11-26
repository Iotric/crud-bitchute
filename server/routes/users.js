import { Router } from 'express';
import User from '../models/User.js';
import requireAuth from '../middleware/auth.js';
import { validators, firstError } from '../validate.js';
import { duplicateMessage } from '../utils.js';

const router = Router();
router.use(requireAuth);

const EDITABLE = ['name', 'username', 'email', 'avatarUrl', 'bio', 'country', 'onboarded'];

router.get('/me', async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

router.patch('/me', async (req, res) => {
  const body = req.body || {};
  const fields = EDITABLE.filter((f) => body[f] !== undefined);

  if (fields.length === 0) return res.status(400).json({ message: 'Nothing to update' });

  const error = firstError(body, fields);
  if (error) return res.status(400).json({ message: error });

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  for (const f of fields) {
    let value = body[f];
    if (typeof value === 'string') value = value.trim();
    if (f === 'email' || f === 'username') value = value.toLowerCase();
    user[f] = value ?? '';
  }

  if (user.isModified('email') && (await User.exists({ email: user.email, _id: { $ne: user._id } }))) {
    return res.status(409).json({ message: 'Email already in use' });
  }
  if (user.isModified('username') && (await User.exists({ username: user.username, _id: { $ne: user._id } }))) {
    return res.status(409).json({ message: 'Username taken' });
  }

  try {
    await user.save();
    res.json({ user });
  } catch (err) {
    const dup = duplicateMessage(err);
    if (dup) return res.status(409).json({ message: dup });
    throw err;
  }
});

router.patch('/me/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (typeof currentPassword !== 'string' || !currentPassword) {
    return res.status(400).json({ message: 'Current password is required' });
  }
  const error = validators.password(newPassword);
  if (error) return res.status(400).json({ message: error.replace('Password', 'New password') });

  const user = await User.findById(req.userId).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!(await user.checkPassword(currentPassword))) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});

router.delete('/me', async (req, res) => {
  const { password } = req.body || {};
  if (typeof password !== 'string' || !password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const user = await User.findById(req.userId).select('+password');
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!(await user.checkPassword(password))) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  await user.deleteOne();
  res.json({ message: 'Account deleted' });
});

export default router;
