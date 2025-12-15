import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { RegisterDto, LoginDto, UserResponse, AuthResponse } from './auth.dto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export class AuthService {
  async register(data: RegisterDto): Promise<AuthResponse> {
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password with bcrypt before storage (never store plaintext)
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      user,
      message: 'User registered successfully',
    };
  }

  async login(data: LoginDto): Promise<{ user: UserResponse; token: string }> {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Use constant-time comparison to prevent timing attacks
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken(user.id);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  async getUserById(userId: number): Promise<UserResponse | null> {
    return await authRepository.findUserById(userId);
  }

  async updateProfile(
    userId: number,
    data: { name?: string; email?: string; currentPassword?: string; newPassword?: string }
  ): Promise<UserResponse> {
    const user = await authRepository.findUserByEmail(
      (await authRepository.findUserById(userId))?.email || ''
    );

    if (!user) {
      throw new Error('User not found');
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await authRepository.emailExists(data.email);
      if (emailExists) {
        throw new Error('Email is already in use');
      }
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new Error('Current password is required');
      }
      const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    }

    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    }

    const updatedUser = await authRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update profile');
    }

    return updatedUser;
  }

  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET as string, {
      expiresIn: JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();
