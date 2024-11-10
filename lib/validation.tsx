import { z } from "zod";

export const UserFormValidation = z.object({
  name: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  email: z.string().email({
    message: "Please provide a valid email address.",
  }),
  phone: z.string().regex(
    /^\+?[1-9]\d{1,14}$/, // Regex for international phone numbers, e.g., +1234567890
    {
      message: "Please provide a valid phone number.",
    }
  ),
});
