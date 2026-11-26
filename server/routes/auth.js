import { Router } from 'express';
import User from '../models/User.js';
import { firstError } from '../validate.js';
import { signToken, duplicateMessage } from '../utils.js';

const router = Router();

router.post('/signup', async (req, res) => {
  const body = req.body || {};
  const error = firstError(body, ['name', 'username', 'email', 'password']);
  if (error) return res.status(400).json({ message: error });

  const email = body.email.trim().toLowerCase();
  const username = body.username.trim().toLowerCase();

  if (await User.exists({ email })) return res.status(409).json({ message: 'Email already in use' });
  if (await User.exists({ username })) return res.status(409).json({ message: 'Username taken' });

  try {
    const user = await User.create({ name: body.name.trim(), username, email, password: body.password });
    res.status(201).json({ token: signToken(user._id), user });
  } catch (err) {
    const dup = duplicateMessage(err);
    if (dup) return res.status(409).json({ message: dup });
    throw err;
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
  if (!user || !(await user.checkPassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({ token: signToken(user._id), user });
});

export default router;
