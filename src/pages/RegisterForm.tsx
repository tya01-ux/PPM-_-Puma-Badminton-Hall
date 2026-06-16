import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "../components/ui/InputText";
import { InputPassword } from "../components/ui/InputPassword";
import { Button } from "../components/ui/Button";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Schema dengan kalimat error yang lebih ringkas dan natural
const schema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email({ message: "Format email salah" }),
  password: z.string().min(6, { message: "Minimal 6 karakter" }),
  passwordConfirm: z.string().min(6, { message: "Minimal 6 karakter" }),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Password tidak sama",
  path: ["passwordConfirm"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("Registrasi Berhasil!");
      navigate("/loginForm");
    }, 1500);
  };

  return (
    // pb-20 agar form tidak tertutup keyboard HP
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-100 to-blue-100 p-4 pb-20">
      
      <div className="relative w-full max-w-sm sm:max-w-md">
        
        {/* KARTU BELAKANG - Sembunyikan di layar kecil untuk estetika mobile */}
        <div className="hidden sm:block absolute inset-0 translate-x-4 translate-y-4 bg-blue-100 rounded-3xl border border-blue-200"></div>

        {/* KARTU DEPAN */}
        <div className="relative w-full p-6 sm:p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900">Daftar Akun</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              Bergabunglah dengan komunitas Puma Badminton Hall
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <InputText 
              label="Nama Lengkap" 
              nama="nama" 
              register={register} 
              error={errors.nama?.message} 
            />
            
            <InputText 
              label="Email" 
              nama="email" 
              register={register} 
              error={errors.email?.message} 
            />

            <InputPassword 
              label="Password" 
              nama="password" 
              register={register} 
              error={errors.password?.message}
              placeholder="Masukkan password anda" 
            />

            <InputPassword 
              label="Konfirmasi Password" 
              nama="passwordConfirm" 
              register={register} 
              error={errors.passwordConfirm?.message}
              placeholder="Konfirmasi password anda" 
            />

            <div className="pt-2">
              <Button
                label={isLoading ? "Memproses..." : "Buat Akun"}
                variant="primary"
                className={`w-full justify-center ${
                  isLoading ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02] transition-transform"
                }`}
              />
            </div>

            <div className="text-center text-sm text-slate-600 pt-4 border-t border-slate-100 mt-6">
              Sudah punya akun?{" "}
              <Link to="/loginForm" className="text-blue-700 font-bold hover:underline">
                Login disini
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}