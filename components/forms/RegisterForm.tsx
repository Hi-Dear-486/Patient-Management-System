"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form, FormControl } from "@/components/ui/form";
import SubmitButton from "../SubmitButton";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePosts } from "@/context/AppContext";
import { FormFieldType } from "./PatientForm";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Doctors, GenderOptions, IdentificationTypes } from "@/constants";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FileUploader } from "../FileUploader";
import { PatientFormValidation, registraionForm } from "@/lib/formSchema";
import CustomFormField from "../CustomFormField";

interface RegisterFormProps {
  Id: string;
}

type PatientFormData = z.infer<typeof PatientFormValidation>;
const RegisterForm = ({ Id }: RegisterFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { posts, getPosts } = usePosts() || {
    posts: [],
    getPosts: () => {},
  };

  const form = useForm<PatientFormData>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: registraionForm,
  });

  const { handleSubmit, reset } = form;

  // Define onSubmit function
  const onSubmit = useCallback<SubmitHandler<PatientFormData>>(
    async (data) => {
      setIsLoading(true);
      try {
        const db = getFirestore(app);
        await setDoc(doc(db, "patientform", Id), data);
        toast.success("Patient form submitted successfully!");
        setIsLoading(false);
        reset();

        if (posts) {
          router.push(`/patients/${Id}/appointment`);
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("An unknown error occurred");
        }
      }
    },
    [Id, posts, router, reset]
  );

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="flex-1 space-y-12">
          <h1>Welcome 🖐</h1>
          <p className="text-gray-700">Let us Know more about yourself.</p>
        </section>
        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="Enter name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="email"
            label="Email"
            placeholder="Enter email"
            iconSrc="/assets/icons/email.svg"
            iconAlt="user"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone Number"
            placeholder="(555) 123-4567"
          />
        </div>

        <div className="flex flex-col gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of Birth"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-11 gap-6 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option) => (
                    <div key={option} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Scanned Copy of Identification Document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <div className="flex flex-col justify-between gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="SOS Canaal road, Faisalaabd"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>

        <div className="flex flex-col justify-between gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency contact number"
            placeholder="Software Engineer"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="primaryPhysician"
          label="Primary care physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor, i) => (
            <SelectItem key={doctor.name + i} value={doctor.name}>
              <div className="flex cursor-pointer items-center gap-2">
                <Image
                  src={doctor.image}
                  width={32}
                  height={32}
                  alt="doctor"
                  className="rounded-full border border-dark-500"
                />
                <p>{doctor.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <div className="flex flex-col justify-between gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="BlueCross BlueShield"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.PHONE_INPUT}
            name="insurancePolicyNumber"
            label="Insurance Policy number"
            placeholder="ABC123456789"
          />
        </div>
        <div className="flex flex-col justify-between gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="Peanuts, Penicillin,Pollen"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current medication (if any)"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>
        <div className="flex flex-col justify-between gap-x-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family Medical History"
            placeholder="Mother had brain cancer, Father had heart disease"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past Medical History"
            placeholder="Appendectomy,Tonsillectomy"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verification</h2>
          </div>
        </section>

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Identification type"
          placeholder="Select a identification type"
        >
          {IdentificationTypes.map((type, i) => (
            <SelectItem key={i} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="identificationNumber"
          label="Identification number"
          placeholder="123456789"
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />
        </section>

        <SubmitButton isLoading={isLoading}>Submit and continue</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
