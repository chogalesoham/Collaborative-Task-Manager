import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository.js';
import { RegisterDto, LoginDto, UserResponse, AuthResponse } from './auth.dto.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const SALT_ROUNDS = 10;

export class AuthService {
  // Register new user
  async register(data: RegisterDto): Promise<AuthResponse> {
    // Check if user already exists
    const existingUser = await authRepository.findUserByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);

    // Create user
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    return {
      user,
      message: 'User registered successfully',
    };
  }

  // Login user
  async login(data: LoginDto): Promise<{ user: UserResponse; token: string }> {
    // Find user by email
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    // Return user without password
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token,
    };
  }

  // Get user by ID
  async getUserById(userId: number): Promise<UserResponse | null> {
    return await authRepository.findUserById(userId);
  }

  // Update user profile
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

    // If updating email, check if it's already taken
    if (data.email && data.email !== user.email) {
      const emailExists = await authRepository.emailExists(data.email);
      if (emailExists) {
        throw new Error('Email is already in use');
      }
    }

    // If updating password, verify current password
    if (data.newPassword) {
      if (!data.currentPassword) {
        throw new Error('Current password is required');
      }
      const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (data.name) updateData.name = data.name;
    if (data.email) updateData.email = data.email;
    if (data.newPassword) {
      updateData.password = await bcrypt.hash(data.newPassword, SALT_ROUNDS);
    }

    // Update user
    const updatedUser = await authRepository.updateUser(userId, updateData);
    if (!updatedUser) {
      throw new Error('Failed to update profile');
    }

    return updatedUser;
  }

  // Generate JWT token
  generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  // Verify JWT token
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
