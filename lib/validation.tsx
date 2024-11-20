import { z } from "zod";

export const UserFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number"),
});

export const PatientFormValidation = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.string().email("invalid email address").optional(),
  phone: z
    .string()
    .refine((phone) => /^\+\d{10,15}$/.test(phone), "Invalid phone number")
    .optional(),

  gender: z.enum(["Male", "Female", "Other"]).optional(),

  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(500, "Address must be at most 500 characters")
    .optional(),
  occupation: z
    .string()
    .min(2, "Occupation must be at least 2 characters")
    .max(500, "Occupation must be at most 500 characters")
    .optional(),
  emergencyContactName: z
    .string()
    .min(2, "Contact name must be at least 2 characters")
    .max(50, "Contact name must be at most 50 characters")
    .optional(),
  emergencyContactNumber: z
    .string()
    .refine(
      (emergencyContactNumber) => /^\+\d{10,15}$/.test(emergencyContactNumber),
      "Invalid phone number"
    )
    .optional(),
  primaryPhysician: z.string().min(2, "Select at least one doctor").optional(),
  insuranceProvider: z
    .string()
    .min(2, "Insurance name must be at least 2 characters")
    .max(50, "Insurance name must be at most 50 characters")
    .optional(),

  insurancePolicyNumber: z
    .string()
    .min(2, "Policy number must be at least 2 characters")
    .max(50, "Policy number must be at most 50 characters")
    .optional(),
  identificationNumber: z
    .string()
    .min(2, "identification  number must be at least 2 characters")
    .max(50, "identification  number must be at most 50 characters"),
  allergies: z.string().min(1, "Allergies information is required."),
  currentMedication: z
    .string()
    .min(1, "Current medication details are required."),
  familyMedicalHistory: z
    .string()
    .min(1, "Family medical history is required."),
  pastMedicalHistory: z.string().min(1, "Past medical history is required."),
  identificationType: z.string().min(1, "Identification type is required."),
  identificationDocument: z.custom<File[]>().optional(),
  treatmentConsent: z.boolean().optional(),
  disclosureConsent: z.boolean().optional(),
  privacyConsent: z.boolean().optional(),
});

export const AppointmentFormValidation = z.object({
  doctor: z
    .string()
    .min(1, "Doctor's name is required")
    .max(100, "Doctor's name must be at most 100 characters long"),

  reasonappointment: z
    .string()
    .min(1, "Reason for appointment is required")
    .min(5, "Reason for appointment must be at least 5 characters long")
    .max(255, "Reason for appointment must be at most 255 characters long"),

  additionalcomments: z
    .string()
    .max(500, "Additional comments must be at most 500 characters long")
    .optional(),

  expectedappointmentdate: z
    .date()
    .refine((value) => !isNaN(value.getTime()), {
      message: "Please provide a valid date",
    })
    .optional(),
});
