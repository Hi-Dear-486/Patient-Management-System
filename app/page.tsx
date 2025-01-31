"use client";
import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";

const PatientForm = dynamic(() => import("@/components/forms/PatientForm"), {
  ssr: false,
});

const Home = () => {
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[496px]">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            priority
            alt="patient"
            className="mb-12 h-10 w-fit"
          />

          {/* <PatientForm /> */}

          <div className="text-14-regular mt-20 flex justify-between">
            <p className="justify-items-end text-dark-600 xl:text-left">
              © 2024 CarePulse
            </p>
          </div>
          <Link href="/login" className="text-green-500">
            Admin
          </Link>
        </div>
      </section>

      <Image
        src="/assets/images/onboarding-img.png"
        height={1000}
        width={1000}
        priority
        alt="patient"
        className="side-img max-w-[50%]"
      />
    </div>
  );
};

export default Home;
