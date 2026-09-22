import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Form } from "react-bootstrap";

export default function PasswordInput({ 
    name, 
    value, 
    onChange, 
    placeholder, 
    label,
    isInvalid,
    required = true 
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            <div className="relative">
                <Form.Control
                    required={required}
                    type={showPassword ? "text" : "password"}
                    name={name}
                    value={value}
                    onChange={onChange}
                    isInvalid={isInvalid}
                    className="w-full p-3 rounded-lg pr-10"
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bg-transparent right-3 top-0 h-full text-gray-400"
                >
                    {showPassword ? (
                        <EyeOff className="cursor-pointer" />
                    ) : (
                        <Eye className="cursor-pointer" />
                    )}
                </button>
            </div>
        </div>
    );
}