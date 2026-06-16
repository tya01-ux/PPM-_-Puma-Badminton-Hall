import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "../components/ui/InputText";
import { InputPassword } from "../components/ui/InputPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";

// Percobaan login
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const schema = z.object({
  username: z.string().min(4, { message: "Username minimal 4 karakter" }),
  password: z.string().min(4, { message: "Password minimal 4 karakter" }),
});

interface FormData {
  username: string;
  password: string;
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

const onSubmit = async (data: FormData) => {
  setIsLoading(true);

  try {
    // Simulasi pengecekan role
    if (data.username === "admin") {
      login({
        id: 1,
        name: "Administrator",
        role: "admin",
      });

      // Redirect khusus admin
      navigate("/admin/dashboard");
    } else {
      login({
        id: 2,
        name: data.username,
        role: "user",
      });

      // Redirect untuk user biasa
      navigate("/");
    }
  } catch (error) {
    console.error("Login failed:", error);
  } finally {
    setIsLoading(false);
  }
};


  return (
<div className="flex items-center justify-center p-4 py-40">
        <div className="relative w-full max-w-md">
        
        {/* KARTU BELAKANG (Layer kedua - warna biru muda agar kontras) */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-blue-100 rounded-3xl border border-blue-200 shadow-sm"></div>

        {/* KARTU DEPAN (Layer utama - Form Login) */}
        <div className="relative w-full p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-puma-dark">Selamat Datang</h2>
            <p className="text-sm text-slate-500 mt-2">
              Masuk ke akun Puma Badminton Hall kamu
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputText
              label="Username"
              nama="username"
              register={register}
              error={errors.username?.message}
            />

            <InputPassword
              label="Password"
              nama="password"
              register={register}
              error={errors.password?.message}
              placeholder="Masukkan password anda" 
            />

            <div className="pt-2">
              <Button
                label={isLoading ? "Memproses..." : "Login"}
                variant="primary"
                className={`w-full justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] active:scale-[0.98] transition-transform"
                }`}
              />
            </div>

            <div className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100 mt-6">
              Belum punya akun?{" "}
              <Link
                to="/registerForm"
                className="text-blue-700 font-bold hover:text-blue-800 hover:underline transition"
              >
                Daftar Disini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}