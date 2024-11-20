"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { AppointmentFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import app from "@/lib/firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { usePosts } from "@/context/AppContext";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { FormFieldType } from "./PatientForm";

const PatientForm = ({ userId }: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { posts, getPosts } = usePosts() || {
    posts: [],
    getPosts: () => {},
  };

  const form = useForm({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      doctor: "",
      reasonappointment: "",
      additionalcomments: "",
      expectedappointmentdate: "",
    },
  });

  const { handleSubmit, reset } = form;

  // Define onSubmit function

  const onSubmit: SubmitHandler<{
    doctor: string;
    reasonappointment: string;
    additionalcomments: string;
    expectedappointmentdate: string;
  }> = async (userData) => {
    getPosts();
    const result = posts.find((item) => item.id === userId);

    if (!result) {
      console.error(`Post with id ${userId} not found`);
      return;
    }
    result.userdata = userData;
    setIsLoading(true);
    try {
      const db = getFirestore(app);
      await setDoc(doc(db, "patientform", userId), result);
      toast.success("Appointment form submitted successfully!");
      setIsLoading(false);
      reset();
      router.push("/");
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
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="doctor"
          label="Doctor"
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
            fieldType={FormFieldType.TEXTAREA}
            name="reasonappointment"
            label="Reason for appointment"
            placeholder="Peanuts, Penicillin,Pollen"
          />

          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="additionalcomments"
            label="Additional comments/notes"
            placeholder="additional comments"
          />
        </div>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.DATE_PICKER}
          name="expectedappointmentdate"
          label="Expected appointment date"
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;
