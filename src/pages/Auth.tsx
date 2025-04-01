import React, { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { useAuth } from "@/hooks/useAuth";

const formSchema = z.object({
  email: z.string().email("Ingresa un email válido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type FormData = z.infer<typeof formSchema>;

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { session } = useAuth();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // If user is already logged in, redirect to home
  if (session) {
    return <Navigate to="/" />;
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Sign up
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        toast.success("Cuenta creada con éxito", {
          description: "Por favor, verifica tu correo para continuar.",
        });
      } else {
        // Sign in
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        toast.success("Inicio de sesión exitoso", {
          description: "Bienvenido a CLAI",
        });

        navigate("/");
      }
    } catch (err) {
      console.error("Authentication error:", err);

      // More user-friendly error messages
      if (err.message.includes("Invalid login credentials")) {
        setError(
          "Credenciales inválidas. Por favor verifica tu email y contraseña."
        );
      } else if (err.message.includes("Email not confirmed")) {
        setError(
          "Email no confirmado. Por favor verifica tu bandeja de entrada."
        );
      } else if (err.message.includes("User already registered")) {
        setError("Este usuario ya está registrado. Intenta iniciar sesión.");
      } else {
        setError(err.message || "Ha ocurrido un error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-chat-darker p-4">
      <div className="w-full max-w-md bg-chat-dark rounded-xl shadow-xl border border-gray-700/30 p-8">
        <div className="flex flex-col items-center mb-8">
          <Logo size={60} />
          <h1 className="mt-6 text-2xl font-bold text-white">
            {isSignUp ? "Crear una cuenta" : "Iniciar sesión"}
          </h1>
          <p className="mt-2 text-gray-400 text-center">
            {isSignUp
              ? "Completa tus datos para comenzar a usar CLAI"
              : "Ingresa tus credenciales para continuar"}
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">
                    Correo electrónico
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-chat-dark"
                      placeholder="nombre@ejemplo.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Contraseña</FormLabel>
                  <FormControl>
                    <Input
                      className="text-chat-dark"
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-chat-accent hover:bg-chat-accent/90"
              disabled={loading}
            >
              {loading
                ? "Procesando..."
                : isSignUp
                ? "Crear cuenta"
                : "Iniciar sesión"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-chat-accent hover:underline text-sm"
          >
            {isSignUp
              ? "¿Ya tienes una cuenta? Inicia sesión"
              : "¿No tienes una cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
