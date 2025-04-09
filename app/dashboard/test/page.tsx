"use client"; // if using in Next.js app directory (Client Component)

import { useEffect } from "react";

const JobStatus = () => {
  useEffect(() => {
    const fetchJobStatus = async () => {
      const url = "https://63ec-2409-40d2-10bb-5a29-e1cc-57fd-db35-5e.ngrok-free.app/job-status/";
      const params = new URLSearchParams({
        job_id: "c40efd3f-c210-493a-9e0d-16159cc76008"
      });

      const headers = {
        accept: "application/json",
        "ngrok-skip-browser-warning": "6024",
      };

      try {
        const response = await fetch(`${url}?${params.toString()}`, {
          method: "GET",
          headers
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response:", data);
      } catch (error: any) {
        console.error("Fetch Error:", error.message);
      }
    };

    fetchJobStatus();
  }, []);

  return (
    <div>
      <h1>Fetching Job Status...</h1>
    </div>
  );
};

export default JobStatus;
