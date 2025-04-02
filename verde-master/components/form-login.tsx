"use client";

import { loginSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { loginAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";

interface FormLoginProps {
  isVerified: boolean
  OAuthAccountNotLinked: boolean
}

const FormLogin = ({ isVerified, OAuthAccountNotLinked }: FormLoginProps) => {
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError(null)
    startTransition(async () => {
      const response = await loginAction(values)
      if (response.error) {
        setError(response.error)
      } else {
        if (response.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }
    })
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage:
          "linear-gradient(to bottom right, #D5E4CF, #9DCC9B, #6EB47D, #499C70, #2A836B, #136B69)",
      }}
    >
      <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-8">
      <h1
        className="text-2xl font-bold text-center mb-2"
        style={{
          backgroundImage:
          "linear-gradient(to right, #6EB47D, #499C70, #2A836B, #136B69)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
      }}
    >
      Bienvenido a IOT LAB
    </h1>
        <p className="text-1xl font-bold text-green-900/60 text-center mb-6">
        Iniciar Sesión
        </p>
        {isVerified && (
          <p className="text-center text-green-600 mb-4 text-sm">
            Correo electrónico verificado, ya puedes iniciar sesión.
          </p>
        )}
        {OAuthAccountNotLinked && (
          <p className="text-center text-red-500 mb-4 text-sm">
            Para confirmar tu identidad, inicia sesión con la misma cuenta que
            usaste originalmente.
          </p>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Correo Electrónico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="tu@email.com"
                      type="email"
                      {...field}
                      className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="••••••••"
                      type="password"
                      {...field}
                      className="border-green-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2"
            >
              {isPending ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-sm text-green-700">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-semibold text-green-800 hover:underline"
            >
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormLogin;