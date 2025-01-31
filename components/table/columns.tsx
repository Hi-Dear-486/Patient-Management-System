"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Doctors } from "@/constants";
import Image from "next/image";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import {
  Mail,
  FolderPen,
  Smartphone,
  FileUser,
  ClipboardPlus,
} from "lucide-react";
import CancelledBtn from "../CancelledBtn";

export type UserData = {
  additionalcomments: string;
  doctor: string;
  expectedappointmentdate: string | Date; // Using union type
};

export type Post = {
  id: string;
  doctor: string;
  name: string;
  email: string;
  phone: number;
  userdata?: UserData;
};

export const columns: ColumnDef<Post | unknown>[] = [
  {
    id: "ID",
    header: () => (
      <div className="flex justify-center items-center gap-2">ID</div>
    ),
    cell: ({ row }) => (
      <p className="text-14-medium text-center">{row.index + 1}</p>
    ),
  },
  {
    accessorKey: "name",
    header: () => (
      <div className="flex   items-center gap-2">
        <FolderPen />
        Name
      </div>
    ),
  },
  {
    id: "email",
    header: () => (
      <div className="flex  items-center gap-2">
        <Mail />
        Email
      </div>
    ),
    cell: ({ row }) => {
      const Email = row.original as Post;
      return <p className="text-14-regular min-w-[120px]">{Email.email}</p>;
    },
  },

  {
    id: "phone",
    header: () => (
      <div className="flex justify-center items-center gap-2">
        <Smartphone />
        Phone
      </div>
    ),
    cell: ({ row }) => {
      const number = row.original as Post;
      return (
        <p className="text-14-regular text-center min-w-[120px]">
          {number.phone}
        </p>
      );
    },
  },

  {
    accessorKey: "schedule",
    id: "schedule",
    header: () => (
      <div className="flex justify-center items-center gap-2">
        <FileUser />
        Appointment
      </div>
    ),

    cell: ({ row }) => {
      const appointment = row.original as Post;
      const isFirestoreTimestamp = (
        value: unknown
      ): value is { seconds: number } => {
        return (
          typeof value === "object" && value !== null && "seconds" in value
        );
      };

      const appointmentDate =
        appointment.userdata?.expectedappointmentdate || null;

      if (!appointmentDate) {
        return (
          <p className="text-14-regular text-center min-w-[120px]">
            No appointment date
          </p>
        );
      }

      let date: Date;

      if (isFirestoreTimestamp(appointmentDate)) {
        date = new Date(appointmentDate.seconds * 1000);
      } else if (
        appointmentDate instanceof Date ||
        typeof appointmentDate === "string"
      ) {
        date = new Date(appointmentDate);
      } else {
        return (
          <p className="text-14-regular text-center min-w-[120px]">
            Invalid appointment date
          </p>
        );
      }

      // Format the Date using date-fns
      const formattedDate = format(date, "MMM dd, yyyy", { locale: enUS });

      return (
        <p className="text-14-regular text-center min-w-[120px]">
          {formattedDate}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: () => (
      <div className="flex items-center  gap-2">
        <ClipboardPlus />
        Doctor
      </div>
    ),
    cell: ({ row }) => {
      const appointment = row.original as Post;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.userdata?.doctor
      );

      return (
        <div className="flex items-center gap-3  min-w-[120px]">
          {doctor?.image && (
            <Image
              src={doctor.image}
              alt="doctor"
              width={100}
              height={100}
              className="size-8"
            />
          )}

          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    header: "Cancelled",

    cell: ({ row }) => {
      const appointment = row.original as Post;
      return <CancelledBtn Id={appointment.id} />;
    },
  },
];
