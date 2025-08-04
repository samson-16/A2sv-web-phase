"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import JobCard from "../components/JobCard";
import { jobprops } from "@/type";
import { Skeleton } from "@/components/ui/skeleton";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/navigation";

// Extend the Window interface to include 'session' for Cypress debugging
declare global {
  interface Window {
    session?: unknown;
    Cypress?: unknown;
  }
}

const BookmarkedJobs = () => {
  const [jobs, setJobs] = useState<jobprops[]>([]);
  const [bookmarkedJobs, setBookmarkedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // When the session loads, if it has an accessToken, save it to localStorage.
    if (session && (session as any).accessToken) {
      localStorage.setItem("accessToken", (session as any).accessToken);
    }
    // This part is for Cypress debugging.
    if (typeof window !== "undefined" && session) {
      window.session = session;
      // Log after setting for extra debug
      // eslint-disable-next-line no-console
      console.log("[CYPRESS DEBUG] window.session after set:", window.session);
    }
  }, [session]);

  useEffect(() => {
    const fetchBookmarks = async () => {
      // Read token from localStorage instead of session
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setBookmarkedJobs([]);
        return;
      }
      // Add a short delay in Cypress to avoid race conditions after bookmarking
      if (window.Cypress) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}bookmarks`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const bookmarkedIds = res.data.data?.map((b: any) => b.eventID) || [];
        setBookmarkedJobs(bookmarkedIds);
      } catch (error) {
        setBookmarkedJobs([]);
      }
    };

    fetchBookmarks();
  }, [session]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}opportunities/search`
        );
        setJobs(response.data.data || []);
      } catch (err) {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto px-4 pt-16">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    );
  }

  const bookmarkedJobList = jobs.filter((job) =>
    bookmarkedJobs.includes(job.id)
  );

  // Add handleToggleBookmark for unbookmarking
  const handleToggleBookmark = async (
    jobId: string,
    currentlyBookmarked: boolean
  ) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("Please sign in to bookmark jobs");
      return;
    }
    try {
      if (currentlyBookmarked) {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_BASE_URL}bookmarks/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBookmarkedJobs((prev) => prev.filter((id) => id !== jobId));
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}bookmarks/${jobId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBookmarkedJobs((prev) => [...prev, jobId]);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    }
  };

  return (
    <div className="mx-auto px-4 pt-16">
      <button
        className="py-4 mt-4 cursor-pointer px-6 bg-blue-600 text-white rounded-md"
        onClick={() => {
          router.push("/jobs");
        }}
      >
        <FaArrowLeftLong />
      </button>
      <h1 className="text-3xl font-bold mb-6">Bookmarked Jobs</h1>
      {bookmarkedJobList.length === 0 ? (
        <p>No bookmarked jobs found.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {bookmarkedJobList.map((job) => (
            <JobCard
              key={job.id}
              {...job}
              isBookmarked={true}
              onToggleBookmark={handleToggleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkedJobs;
