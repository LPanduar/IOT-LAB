"use client";

import { registerSchema } from "@/lib/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { registerAction } from "@/actions/auth-action";
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

const FormRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof registerSchema>) {
    setError(null);
    startTransition(async () => {
      const response = await registerAction(values);
      if (response.error) {
        setError(response.error);
      } else {
        router.push("/dashboard");
      }
    });
  }

  return (
    <div
    className="min-h-screen flex items-center justify-center p-4"
    style={{
      backgroundImage:
        "linear-gradient(to bottom right, #D5E4CF, #9DCC9B, #6EB47D, #499C70, #2A836B, #136B69)",
    }}
      >
      <div className=" max-w-xs bg-white rounded-lg shadow-lg p-8">
      <h1
        className="text-3xl font-bold text-center mb-2"
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
        <h1 className="text-1xl font-bold text-green-800 text-center mb-6">
          Registrarse
        </h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-green-700">Nombre</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tu nombre"
                      type="text"
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
              {isPending ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <p className="text-sm text-green-700">
            ¿Ya tienes una cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold text-green-800 hover:underline"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FormRegister;