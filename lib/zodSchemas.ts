import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().max(50, "Name is too long").min(2, "Name is too short"),
  email: z.string().email().toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Phone Number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Password must include at least one special character"
    ),
});
