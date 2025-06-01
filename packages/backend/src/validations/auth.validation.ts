import { z } from 'zod';
import { UserRole } from '@prisma/client';

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2),
    role: z.enum([UserRole.CUSTOMER, UserRole.COMPANY, UserRole.TRANSPORTER]),
    phone: z.string().optional(),
    address: z.string().optional(),
    companyName: z.string().optional(),
    companyLicense: z.string().optional(),
  }).refine((data) => {
    // For COMPANY role, companyName is required
    if (data.role === UserRole.COMPANY && !data.companyName) {
      return false;
    }
    return true;
  }, {
    message: "Company name is required for company accounts",
    path: ["companyName"],
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body']; 