"use client";

import IntakeForm from "@/app/components/IntakeForm";

export default function IntakePage() {
  return (
    <main className="flex items-center justify-center w-full bg-white text-black overflow-hidden">
      {/* Form Container */}
      <div className="w-full z-10 relative">
        <IntakeForm />
      </div>
    </main>
  );
}
