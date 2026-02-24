import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/user.js';
import { createSession, setSessionCookies } from '../services/auth.js';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  // Перевірка чи існує користувач
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw createHttpError(400, 'Email in use');
  }

  // Хешування пароля
  const hashedPassword = await bcrypt.hash(password, 10);

  // Створення користувача
  const user = await User.create({
    email,
    password: hashedPassword,
  });

  // Створення сесії
  const session = await createSession(user._id);

  // Встановлення кукі
  setSessionCookies(res, session);

  res.status(201).json(user);
};
