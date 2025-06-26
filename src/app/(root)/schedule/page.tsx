"use client"

import LoaderUI from "@/components/LoaderUI";
import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/router";



function Schedule() {
    const router = useRouter();
    const {isInterviewer, isLoading} = useUserRole();

    if (isLoading) return <LoaderUI />;

    if (!isInterviewer) return router.push("/");

    

  return (
    <div>
      
    </div>
  )
}

export default Schedule
