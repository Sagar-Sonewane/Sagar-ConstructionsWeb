import { z } from "zod";

// Phone validation pattern for Indian phone numbers (10 digits starting with 6-9)
const phoneRegex = /^[6-9]\d{9}$/;
const validatePhone = z
  .string()
  .min(10, "Phone number must be exactly 10 digits")
  .max(15, "Phone number is too long")
  .transform((val) => val.replace(/\s+/g, "")) // Remove spaces
  .refine((val) => phoneRegex.test(val), "Please enter a valid 10-digit mobile number (e.g., 9876543210)");

// Common email validation
const validateEmail = z
  .string()
  .email("Invalid email address")
  .or(z.literal(""))
  .optional();

// 1. Contact Form Schema
export const contactSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  serviceInterested: z.string().min(1, "Please select a service"),
  message: z.string().min(5, "Message must be at least 5 characters").max(1000, "Message cannot exceed 1000 characters"),
});

// 2. Appointment Booking Schema
export const appointmentSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  address: z.string().min(5, "Please enter a valid site or correspondence address").max(500),
  selectedService: z.string().min(1, "Please select a service"),
  preferredDate: z.string().refine((val) => {
    const selected = new Date(val);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selected >= today;
  }, "Preferred date cannot be in the past"),
  preferredTime: z.string().min(1, "Please choose a preferred time slot"),
  additionalNotes: z.string().max(1000, "Notes cannot exceed 1000 characters").optional(),
});

// 3. Free Consultation Schema
export const consultationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  constructionType: z.string().min(1, "Please select a construction type"),
  plotSize: z.string().min(2, "Please specify plot size (e.g. 30x40 ft or 1200 sqft)"),
  budget: z.string().min(2, "Please specify your estimated budget"),
  address: z.string().min(5, "Please enter site address").max(500),
  message: z.string().min(5, "Please enter a message detailing your ideas").max(1000),
});

// 4. Quotation Request Schema
export const quotationSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  service: z.string().min(1, "Please select a service"),
  estimatedBudget: z.string().min(2, "Please specify estimated budget"),
  plotSize: z.string().min(2, "Please specify plot size"),
  projectDescription: z.string().min(5, "Please describe your project").max(1000),
});

// 5. Sell Property Schema
export const sellPropertySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  propertyType: z.string().min(1, "Please select a property type"),
  propertyLocation: z.string().min(2, "Please enter the location of the property").max(500),
  area: z.string().min(2, "Please enter the area (e.g. 1500 sqft)"),
  expectedPrice: z.string().min(2, "Please enter expected price"),
  propertyDescription: z.string().min(5, "Please describe the property").max(1000),
});

// 6. Buy Property Schema
export const buyPropertySchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  phone: validatePhone,
  email: validateEmail,
  preferredLocation: z.string().min(2, "Please enter preferred locations").max(500),
  budget: z.string().min(2, "Please enter budget range"),
  propertyType: z.string().min(1, "Please select property type"),
  requirements: z.string().min(5, "Please enter your requirements").max(1000),
});

// File validation rules (5MB, images only)
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export const fileValidation = z
  .instanceof(File)
  .refine((file) => file.size <= MAX_FILE_SIZE, "Max file size is 5MB")
  .refine(
    (file) => ALLOWED_FILE_TYPES.includes(file.type),
    "Only .jpg, .jpeg, .png, .webp, and .gif files are allowed"
  );
