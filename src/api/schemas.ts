import { z } from 'zod';

/** API contracts. A response that drifts from these shapes fails the test with a readable diff. */

export const LoginResponse = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  email: z.string().includes('@'),
  accessToken: z.string().min(20),
  refreshToken: z.string().min(20),
});

export const User = z.object({
  id: z.number().int().positive(),
  username: z.string(),
  email: z.string().includes('@'),
  firstName: z.string(),
  lastName: z.string(),
});

export const Product = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  description: z.string(),
  category: z.string(),
  price: z.number().nonnegative(),
  discountPercentage: z.number().min(0).max(100),
  rating: z.number().min(0).max(5),
  stock: z.number().int().nonnegative(),
});

export const ProductPage = z.object({
  products: z.array(Product),
  total: z.number().int().nonnegative(),
  skip: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
});

export const CartProduct = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  total: z.number().nonnegative(),
});

export const Cart = z.object({
  id: z.number().int().positive(),
  userId: z.number().int().positive(),
  products: z.array(CartProduct),
  total: z.number().nonnegative(),
  discountedTotal: z.number().nonnegative(),
  totalProducts: z.number().int().nonnegative(),
  totalQuantity: z.number().int().nonnegative(),
});

export const ErrorResponse = z.object({
  message: z.string().min(1),
});

export type ProductT = z.infer<typeof Product>;
export type CartT = z.infer<typeof Cart>;
