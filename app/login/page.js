"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import Image from "next/image";

const Login = () => {
  const handleGoogleSignIn = () => {
    signIn("google"); // Triggers Google sign-in
  };

  const { data: session } = useSession();
  const router = useRouter();

  console.log("outside session", session);
  useEffect(() => {
    if (session) {
      console.log("inside session", session);
      // Redirect to home after successful login
      router.push("/");
    }
  }, [session, router]);

  return (
    <div className="h-screen w-screen flex justify-center items-center">
      {/* Modal */}
      <div className="fixed backdrop-blur-sm top-0 right-0 left-0 z-50 inset-0 flex justify-center items-center">
        <div className="relative container mx-auto px-6 md:w-7/12">
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl p-8">
            <h1 className="mb-8 text-3xl text-cyan-900 dark:text-white font-bold text-center">
              WitsCTF
            </h1>

            <div className="mt-10 flex justify-center">
              <button
                onClick={handleGoogleSignIn}
                className="group h-14 px-8 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400  active:bg-blue-100"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src="https://www.svgrepo.com/show/475656/google-color.svg"
                    className="w-6"
                    alt="google logo"
                  />
                  <span className="font-semibold tracking-wide text-gray-700 dark:text-white text-base transition duration-300 group-hover:text-blue-600">
                    Continue with Google
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
