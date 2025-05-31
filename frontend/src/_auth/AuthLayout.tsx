import Logo from "@/components/Logo";
import TextAnimationHeading from "@/components/TextAnimationHeading";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <>
      <div className="grid h-full max-h-screen min-h-screen w-full lg:grid-cols-2">
        {/**animation text and logo */}
        <div className="bg-primary/10 hidden flex-col p-10 lg:flex">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="flex h-full flex-col justify-center">
            <TextAnimationHeading className="mx-0 flex-row lg:gap-1" />
          </div>
        </div>
        <Suspense fallback={<p>Loading...</p>}>
          <div className="mt-14 flex h-full grid-cols-1 flex-col overflow-auto px-4 lg:mt-0 lg:justify-center lg:p-6">
            <Outlet />
          </div>
        </Suspense>
      </div>
    </>
  );
}
