"use client";

import { useOrganization, useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { UploadFile } from "./upload-file";
import { FileCard } from "./file-card";
import Image from "next/image";

export default function Home() {
  const organization = useOrganization();
  const user = useUser();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container mx-auto pt-8">
      {/* Loading... spinner*/}
      {isLoading && (
        <div className="flex flex-col gap-2 items-center mt-32">
          <Loader2 className="h-8 w-8 animate-spin text-slate-700" />
          <p className="text-xl">Loading...</p>
        </div>
      )}

      {/* if has no data in database */}
      {!isLoading && files.length === 0 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <Image
            alt="Empty data picture"
            src="/empty.svg"
            width="280"
            height="280"
          />
          <p className="text-balance">
            You do not have any files yet, upload one now.
          </p>
          <UploadFile />
        </div>
      )}

      {/* If has data */}
      {!isLoading && files.length > 0 && (
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Files</h1>
          <UploadFile />
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {files?.map((file) => {
          return <FileCard key={file._id} file={file} />;
        })}
      </div>
    </main>
  );
}
