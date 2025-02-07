import { z } from "zod";

export const signUpFormSchema = z.object({
  name: z.string().max(50, "Name is too long").min(3, "Name is too short"),
  email: z
    .string({ message: "Invalid Email" })
    .email({ message: "Invalid Email" })
    .toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Phone Number"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export const signInFormSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email({ message: "Invalid Email" })
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[\W_]/, "Password must contain at least one special character"),
});

export const categoryCheck = z.enum([
  "men",
  "co-ord-sets",
  "pants",
  "jumpsuits",
  "shorts",
  "dresses",
  "outerwear",
  "tops",
  "skirts",
  "lounge-wear",
]);

export const pageNumber = z.number().int().positive();

export const AddressFormSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(3, "Name must be minimum 3 characters")
    .max(50, "Name is too long"),
  lastName: z.string().max(40, "Name is too long"),
  email: z.string().email("Invalid email").toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Phone Number"),
  address1: z.string().min(30, "Address too short").max(60, "Address too long"),
  address2: z.string().min(30, "Address too short").max(60, "Address too long"),
  city: z.string().max(20, "City name too long"),
  state: z.string(),
  zipcode: z
    .string()
    .regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, "Invalid Zipcode"),
  landmark: z.string(),
});
