import prisma from '../lib/prisma.js';
import { CreateUserInput, UpdateUserInput, UserResponse } from '../models/user.model.js';

export class UserRepository {
  /**
   * Find user by email
   */
  async findByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find user by ID (without password)
   */
  async findById(id: number): Promise<UserResponse | null> {
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

  /**
   * Create new user
   */
  async create(data: CreateUserInput): Promise<UserResponse> {
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

  /**
   * Update user by ID
   */
  async update(id: number, data: UpdateUserInput): Promise<UserResponse> {
    return await prisma.user.update({
      where: { id },
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

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return !!user;
  }

  /**
   * Delete user by ID
   */
  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}

export const userRepository = new UserRepository();
