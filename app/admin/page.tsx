"use client";
import UserSetting from "@/components/forms/UserSetting";
import StatCard from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { usePosts } from "@/context/AppContext";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";

const Dashboard = () => {
  const { posts, getPosts } = usePosts()!;
  const myData = posts.filter((item) => {
    return item.userdata;
  });
  useEffect(() => {
    getPosts();
  }, [getPosts]);

  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="Logo"
            className="h-8 w-fit"
          />
        </Link>

        <UserSetting />
      </header>

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={0}
            label="Scheduled appointments"
            icon={"/assets/icons/appointments.svg"}
          />
          <StatCard
            type="pending"
            count={10}
            label="Pending appointments"
            icon={"/assets/icons/pending.svg"}
          />
          <StatCard
            type="cancelled"
            count={14}
            label="Cancelled appointments"
            icon={"/assets/icons/cancelled.svg"}
          />
        </section>
        <DataTable columns={columns} data={myData} />
      </main>
    </div>
  );
};

export default Dashboard;
