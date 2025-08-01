import { z } from "zod";

export const categories = ["dresses", "co ord set", "ethnic"] as const;

export const CreateProductFormSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be minimum 3 characters")
    .max(50, "Title is too long"),
  description: z
    .string()
    .min(100, "Description must be minimum 100 characters")
    .max(500, "Description is too long"),
  productDetails: z.string().min(1, { message: "Details are required" }),
  modelSize: z.string().min(1, { message: "Model size is required" }),
  vibeCheck: z.string().min(1, { message: "Vibe check is required" }),
  price: z.number().int().min(1, "Price must be at least 1"),
  category: z.enum(categories),
  isArchived: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  smallQuantity: z.number().min(1, "Quantity must be at least 1"),
  mediumQuantity: z.number().min(1, "Quantity must be at least 1"),
  largeQuantity: z.number().min(1, "Quantity must be at least 1"),
  xlQuantity: z.number().min(1, "Quantity must be at least 1"),
  doubleXlQuantity: z.number().min(1, "Quantity must be at least 1"),
  color: z.string().min(3, "Required"),
  length: z.number().min(1, "Length must be at least 1"),
  breadth: z.number().min(1, "Breadth must be at least 1"),
  height: z.number().min(1, "Height must be at least 1"),
  weight: z.number().min(1, "Weight must be at least 1"),
});

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
});

export const signInFormSchema = z.object({
  emailOrPhone: z
    .string()
    .min(1, "Email or phone number is required")
    .refine(
      (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[6-9]\d{9}$/;
        return emailRegex.test(value) || phoneRegex.test(value);
      },
      {
        message: "Please enter a valid email address or 10-digit phone number",
      }
    ),
});

export const categoryCheck = z.enum(["dresses", "co ord set", "ethnic"]);

export const pageNumber = z.number().int().positive();

export const AddressFormSchema = z.object({
  id: z.string().optional(),
  firstName: z
    .string()
    .min(3, "Name must be minimum 3 characters")
    .max(50, "Name is too long"),
  lastName: z.string().max(40, "Name is too long").min(1, "Name is too short"),
  email: z.string().email("Invalid email").toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Phone Number"),
  address1: z
    .string()
    .min(30, "Address too short")
    .max(60, "Address too long")
    .trim(),
  address2: z
    .string()
    .min(30, "Address too short")
    .max(60, "Address too long")
    .trim(),
  city: z.string().max(20, "City name too long").min(1, "City name too short"),
  state: z.string().min(1, "Invalid State"),
  zipcode: z
    .string()
    .regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, "Invalid Zipcode"),
  landmark: z.string().min(5, "Landmark must be minimum 2 characters"),
});

export const CreateCheckoutUser = z.object({
  emailOffers: z.boolean(),
  firstName: z
    .string()
    .min(3, "Name must be minimum 3 characters")
    .max(50, "Name is too long"),
  lastName: z
    .string()
    .min(1, "Name must be minimum 1 characters")
    .max(40, "Name is too long"),
  email: z
    .string({ message: "Invalid Email" })
    .email({ message: "Invalid Email" })
    .toLowerCase(),
  phone: z
    .string()
    .min(10, "Phone Number must be 10 digits")
    .max(10, "Phone Number must be 10 digits")
    .regex(/^[6-9]\d{9}$/, "Invalid Phone Number"),
  address1: z
    .string()
    .min(30, "Address too short")
    .max(60, "Address too long")
    .trim(),
  address2: z
    .string()
    .min(30, "Address too short")
    .max(60, "Address too long")
    .trim(),
  city: z.string().max(20, "City name too long").min(1, "City name too short"),
  state: z.string().min(1, "State name too short"),
  zipcode: z
    .string()
    .regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, "Invalid Zipcode"),
  landmark: z.string().min(1, "Landmark too short"),
});

export const pincodeSchema = z.object({
  pincode: z
    .string()
    .regex(/^[1-9]{1}[0-9]{2}\s{0,1}[0-9]{3}$/, "Invalid Pincode"),
});
