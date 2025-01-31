"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { UserFormValidation } from "@/lib/formSchema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePosts } from "@/context/AppContext";
import { getAuth } from "firebase/auth";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { posts } = usePosts() || {
    posts: [],
    getPosts: () => {},
  };

  const form = useForm({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const { handleSubmit, reset } = form;

  // Define onSubmit function
  const onSubmit = async ({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        toast.error("You must be logged in to submit the form");
        setIsLoading(false);
        return;
      }
      const userData = { name, email, phone };
      const db = getFirestore(app);
      await setDoc(doc(db, "patientform", Date.now().toString()), {
        ...userData,
      });
      toast.success("Patient form submitted successfully!");
      setIsLoading(false);
      reset();
      if (posts) {
        router.push(`/patients/${Date.now().toString()}/register`);
      }
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex-1">
        <section className="mb-12 space-y-4">
          <h1>Hi there 🖐</h1>
          <p className="text-gray-700">Schedule your firt appointment</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Enter name"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
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
          label="Phone number"
          placeholder="(555) 123-4567"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
