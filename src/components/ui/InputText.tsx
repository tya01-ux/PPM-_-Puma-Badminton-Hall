interface InputTextProps{
    label: string;
    nama: string;
    error?: string; 
    register: any;
}

export const InputText: React.FC<InputTextProps> = ({label, nama, error, register}) => {
    return (
        <div className="flex flex-col gap-1 mb-4">
            <label htmlFor={nama} className="text-sm font-medium text-gray-700">
                {label}
            </label>
            <input 
                id={nama} // PENTING: Tambahkan ID ini
                type="text"
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 ${
                    error ? "border-red-500 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                {...register(nama, { required: `${label} harus diisi` })}
                placeholder={`Masukan ${label.toLowerCase()} anda`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    )
}