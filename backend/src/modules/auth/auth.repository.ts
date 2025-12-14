import prisma from '../../lib/prisma.js';
import { RegisterDto } from './auth.dto.js';

export class AuthRepository {
  // Find user by email
  async findUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  // Find user by ID
  async findUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Create new user
  async createUser(data: RegisterDto & { password: string }) {
    return await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  // Check if email exists
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  // Update user
  async updateUser(userId: number, data: { name?: string; email?: string; password?: string }) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}

export const authRepository = new AuthRepository();
