import { useState } from 'react';

interface InputPasswordProps{
    label: string;
    nama: string;
    error?: string; 
    register: any;
}

export const InputPassword: React.FC<InputPasswordProps> = ({label, nama, error, register}) => {
    const [show, setShow] = useState<boolean>(false);
    
    return (
        <div className="flex flex-col gap-1 mb-4">
            <label htmlFor={nama} className="text-sm font-medium">{label}</label>
            <div className="relative">
                <input 
                    id={nama} 
                    className={`w-full border rounded px-3 py-2 focus:outline-none ${error ? "border-red-500" : "border-gray-300"}`}
                    type={show ? "text" : "password"}
                    {...register(nama, {required: `${label} harus diisi`})}
                    placeholder={`Masukan ${label.toLowerCase()} anda`} 
                />
                
                {/* Show/Hidenya di dalem euy */}
                <button 
                    type="button" 
                    className="absolute right-3 top-2.5 text-sm text-blue-500"
                    onClick={() => setShow(!show)}>
                    {show ? "Hide" : "Show"}
                </button>
            </div>

            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}