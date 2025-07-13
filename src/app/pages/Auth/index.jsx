import { useState } from "react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import Logo from "assets/appLogo.svg?react";
import { Button, Card, Checkbox, Input, InputErrorMsg } from "components/ui";
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
      username: "username",
      password: "password",
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
      <main className="relative grid min-h-screen w-full grow grid-cols-1 place-items-center overflow-hidden">
        <CloudinaryBg
          publicId="nx7slzy4lrunswsudfet_psange"
          width={1920}
          height={1080}
          className="absolute inset-0 z-0 w-full h-screen object-cover brightness-75"
        />

        <div className="z-10 w-full max-w-[26rem] p-4 sm:px-5">
          <div className="text-center">
            <Logo className="mx-auto size-16" />
            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-white drop-shadow-md">
                Welcome Back
              </h2>
              <p className="text-white/80 drop-shadow-sm">
                Please sign in to continue
              </p>
            </div>
          </div>

          <Card className="mt-5 rounded-lg bg-white/90 p-5 backdrop-blur-md lg:p-7">
            <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
              <div className="space-y-4">
                <Input
                  label="Username"
                  placeholder="Enter Username"
                  prefix={<EnvelopeIcon className="size-5" strokeWidth="1" />}
                  {...register("username")}
                  error={errors?.username?.message}
                />
                <Input
                  label="Password"
                  placeholder="Enter Password"
                  type="password"
                  prefix={<LockClosedIcon className="size-5" strokeWidth="1" />}
                  {...register("password")}
                  error={errors?.password?.message}
                />
              </div>

              <div className="mt-2">
                <InputErrorMsg when={errorMessage?.message}>
                  {errorMessage?.message}
                </InputErrorMsg>
              </div>

              <div className="mt-4 flex items-center justify-between space-x-2">
                <Checkbox label="Remember me" />
                <a
                  href="#"
                  className="text-xs text-gray-600 hover:text-gray-900"
                >
                  Forgot Password?
                </a>
              </div>

              <Button
                type="submit"
                className="mt-5 w-full flex items-center justify-center gap-2"
                color="primary"
                disabled={isLoading}
              >
                {isLoading && (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                )}
                <span>{isLoading ? "Signing In..." : "Sign In"}</span>
              </Button>
            </form>
          </Card>

          <div className="mt-8 flex justify-center text-xs text-white/90">
            <a href="#">Privacy Notice</a>
            <div className="mx-2.5 my-0.5 w-px bg-white/50"></div>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </main>
    </Page>
  );
}
