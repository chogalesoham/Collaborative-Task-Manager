import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  currentPassword: z.string().min(1, 'Current password is required').optional(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters').optional(),
// Cross-field validation: require current password when setting new password
}).refine((data) => {
  if (data.newPassword && !data.currentPassword) {
    return false;
  }
  return true;
}, {
  message: 'Current password is required to set a new password',
  path: ['currentPassword'],
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
