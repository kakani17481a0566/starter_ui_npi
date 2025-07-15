import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ArrowPathIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

// import Logo from "assets/appLogo.svg?react";
// import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
import { Button, Card, Input, InputErrorMsg } from "components/ui";

import { useAuthContext } from "app/contexts/auth/context";
import { schema } from "./schema";
import { Page } from "components/shared/Page";
import CloudinaryBg from "./cloudinaryBg";

export default function SignIn() {
  const { login, errorMessage } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await login({
        username: data.username,
        password: data.password,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page title="Login">
      <main className="relative grid min-h-screen w-full place-items-center overflow-hidden">
        {/* Background */}
        <CloudinaryBg
          publicId="nx7slzy4lrunswsudfet_psange"
          width={1920}
          height={1080}
          className="absolute inset-0 z-0 h-full w-full object-cover brightness-75"
        />

        <div className="z-10 w-full max-w-3xl px-4">
          <Card className="flex flex-col overflow-hidden rounded-2xl bg-white/90 shadow-2xl backdrop-blur-md sm:flex-row">
            {/* Left Image Panel */}
            <div
              className="hidden items-center justify-center bg-cover bg-center sm:flex sm:w-1/2"
              style={{
                backgroundImage:
                  "url('https://res.cloudinary.com/kakani7/image/upload/v1750923624/MSI/LOGIN_PAGE/c5okkfelbao4zxbsoc11.jpg')",
              }}
            />

            {/* Right Form Panel */}
            <div className="flex w-full flex-col justify-center bg-white px-6 py-8 sm:w-1/2">
              {/* <div className="text-center mb-4">
                <Logo className="mx-auto size-16" />
                <div className="mt-2">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-gray-500">
                    Please sign in to continue
                  </p>
                </div>
              </div> */}
              <div className="rounded-xl border border-black p-4 text-white shadow-md text-primary-950">
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <div className="space-y-4 text-primary-950">
                    <Input
                      label="Username"
                      placeholder="Enter Username"
                      prefix={
                        <EnvelopeIcon className="size-5" strokeWidth="1" />
                      }
                      {...register("username")}
                      error={errors?.username?.message}
                    />
                    <Input
                      label="Password"
                      placeholder="Enter Password"
                      type="password"
                      prefix={
                        <LockClosedIcon className="size-5" strokeWidth="1" />
                      }
                      {...register("password")}
                      error={errors?.password?.message}
                    />
                  </div>

                  <div className="mt-2">
                    <InputErrorMsg when={errorMessage?.message}>
                      {errorMessage?.message}
                    </InputErrorMsg>
                  </div>

                  <div className="mt-5 flex justify-end">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`border-primary-600 flex items-center gap-2 rounded-full border bg-white px-4 py-1.5 text-xs transition-all duration-200 ${
                        isLoading
                          ? "text-primary-600 cursor-not-allowed opacity-70"
                          : "text-primary-600 hover:bg-primary-50"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <ArrowPathIcon className="text-primary-600 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        <>
                          Sign In
                          <ArrowRightIcon className="text-primary-600 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </Page>
  );
}
