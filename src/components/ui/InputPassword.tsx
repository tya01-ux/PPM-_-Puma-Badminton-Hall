import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react'; // Pastikan sudah install lucide-react

interface InputPasswordProps {
    label: string;
    nama: string;
    error?: string; 
    register: any;
    placeholder?: string; // Tambahkan prop placeholder
}

export const InputPassword: React.FC<InputPasswordProps> = ({ label, nama, error, register, placeholder }) => {
    const [show, setShow] = useState<boolean>(false);
    
    return (
        <div className="flex flex-col gap-1 mb-4 w-full">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            <div className="relative w-full">
                <input 
                    className={`w-full border rounded-lg px-3 py-2.5 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                    type={show ? "text" : "password"}
                    {...register(nama)} 
                    placeholder={placeholder} // Menggunakan placeholder custom
                />
                <button 
                    type="button" 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    onClick={() => setShow(!show)}
                >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
};