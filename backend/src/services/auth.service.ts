import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userRepository } from '../repositories/user.repository.js';
import { RegisterDto, LoginDto } from '../modules/auth/auth.dto.js';
import { UpdateProfileDto } from '../modules/auth/profile.dto.js';
import { UserResponse } from '../models/user.model.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  private readonly JWT_SECRET: string;
  private readonly JWT_EXPIRES_IN: string;
  private readonly SALT_ROUNDS = 10;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
    this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
  }

  /**
   * Register new user
   */
  async register(data: RegisterDto): Promise<{ user: UserResponse; token: string }> {
    // Check if user already exists
    const existingUser = await userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new AppError('User with this email already exists', 400);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, this.SALT_ROUNDS);

    // Create user
    const user = await userRepository.create({
      ...data,
      password: hashedPassword,
    });

    // Generate token
    const token = this.generateToken(user.id);

    return { user, token };
  }

  /**
   * Login user
   */
  async login(data: LoginDto): Promise<{ user: UserResponse; token: string }> {
    // Find user by email
    const user = await userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: number): Promise<UserResponse | null> {
    return await userRepository.findById(userId);
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: number, data: UpdateProfileDto): Promise<UserResponse> {
    const user = await userRepository.findByEmail(
      (await userRepository.findById(userId))?.email || ''
    );

    if (!user) {
      throw new AppError('User not found', 404);
    }

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const emailExists = await userRepository.emailExists(data.email);
      if (emailExists) {
        throw new AppError('Email is already in use', 400);
      }
    }

    // If updating password, verify current password
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new AppError('Current password is required', 400);
      }
      const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new AppError('Current password is incorrect', 400);
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, this.SALT_ROUNDS);
    }

    // Update user
    const updatedUser = await userRepository.update(userId, updateData);
    return updatedUser;
  }

  /**
   * Generate JWT token
   */
  generateToken(userId: number): string {
    return jwt.sign({ userId }, this.JWT_SECRET as string, {
      expiresIn: this.JWT_EXPIRES_IN as string,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: number };
      return decoded;
    } catch (error) {
      throw new AppError('Invalid or expired token', 401);
    }
  }
}

export const authService = new AuthService();
