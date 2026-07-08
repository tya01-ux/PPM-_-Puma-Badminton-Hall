import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "../components/ui/InputText";
import { InputPassword } from "../components/ui/InputPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import axios from "axios"; 

const API_URL = import.meta.env.VITE_URL_BACKEND || "http://localhost:3000";

const schema = z.object({
  username: z.string().email({ message: "Format harus berupa email resmi" }), 
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
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: data.username, 
        password: data.password,
      });

      if (response.data && response.data.data) {
        const { token, user } = response.data.data;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        login(user); 

        alert("Login berhasil!");

        if (user.role?.toLowerCase() === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert("Gagal memproses data dari server.");
      }
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(error.response?.data?.message || "Email atau password salah!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 py-40">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-blue-100 rounded-3xl border border-blue-200 shadow-sm"></div>

        <div className="relative w-full p-8 bg-white rounded-3xl shadow-2xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-puma-dark">Selamat Datang</h2>
            <p className="text-sm text-slate-500 mt-2">
              Masuk ke akun Puma Badminton Hall kamu
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <InputText
              label="Email"
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