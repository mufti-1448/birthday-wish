import React, { Suspense } from "react";
import BirthdayClient from "../components/BirthdayClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <BirthdayClient />
    </Suspense>
  );
}
