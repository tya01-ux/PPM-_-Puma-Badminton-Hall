interface ButtonProps {
  label: string;
  variant?: "primary" | "outline";
  className?: string;
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = "primary",
  className,
  onClick 
}) => {
  const baseStyle = "px-10 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95";
  
  const variantStyle =
    variant === "primary"
      ? "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20"
      : "border-2 border-blue-600 text-blue-600 hover:bg-blue-50";

  return (
    <button 
      onClick={onClick}
      className={`${baseStyle} ${variantStyle} ${className}`}
    >
      {label}
    </button>
  );
};