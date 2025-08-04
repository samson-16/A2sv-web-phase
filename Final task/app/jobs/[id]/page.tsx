"use client";
import JobDescription from "@/app/components/JobDescription";
import { notFound } from "next/navigation";
import axios from "axios";


interface JobPageProps {
  params: Promise<{ id: string }>;
}

import React from "react";

const JobPage = async ({ params }: JobPageProps) => {
  // Unwrap params if it's a Promise (Next.js 14+)
   const { id } = React.use(params);
  let job = null;
  try {
    const response = await axios.get(
      `https://akil-backend.onrender.com/opportunities/${id}`
    );
    job = response.data.data;
  } catch (e) {
    job = null;
  }

  if (!job) {
    return <div className="p-8 text-center text-red-600">Job not found</div>;
  }
  return (
    <div className="mx-auto px-4 pt-8">
      <JobDescription job={job} />
    </div>
  );
};

export default JobPage;
