import { Lock, Eye, EyeOff, ArrowLeft, Shield } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext.jsx";
import MessageAlert from "./MessageAlert.jsx";
import logo from "@/resources/logo.png";
import { apiFetch } from "@/api/api.js";

export default function ResetPassword() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { start, complete } = useTopLoader();
    
    const [formData, setForm] = useState({
        password: "",
        confirmPassword: ""
    });

    useEffect(() => {
        const email = sessionStorage.getItem('resetEmail');
        if (!email) {
            navigate('/forgot-password');
        }
    }, [navigate]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (response) setResponse(null);
    }, [response]);

    const validatePassword = useCallback((password) => {
        const errors = [];
        if (password.length < 8) errors.push("At least 8 characters");
        if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
        if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
        if (!/[0-9]/.test(password)) errors.push("One number");
        if (!/[!@#$%^&*]/.test(password)) errors.push("One special character (!@#$%^&*)");
        return errors;
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setResponse({ success: false, message: "Please fill all required fields" });
            setLoading(false);
            return;
        }

        const passwordErrors = validatePassword(formData.password);
        if (passwordErrors.length > 0) {
            setResponse({ success: false, message: `Password must contain: ${passwordErrors.join(", ")}` });
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setResponse({ success: false, message: "Passwords do not match" });
            setLoading(false);
            return;
        }

        try {
            start();
            const email = sessionStorage.getItem('resetEmail');
            const payload = { 
                email, 
                newPassword: formData.password,
                confirmPassword: formData.confirmPassword
            };

            const data = await apiFetch('/api/auth/reset_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (data.success) {
                sessionStorage.removeItem('resetEmail');
                sessionStorage.removeItem('resetTimestamp');
                setResponse({ success: true, message: "Password reset successful! Redirecting to login..." });
                setTimeout(() => navigate('/login'), 3000);
            } else {
                setResponse({ success: false, message: data.message || "Failed to reset password" });
            }
        } catch (error) {
            setResponse({ success: false, message: "Network error. Please try again." });
        } finally {
            setLoading(false);
            complete();
        }
    }, [formData, validatePassword, navigate, start, complete]);

    const passwordErrors = validatePassword(formData.password);
    const isPasswordValid = formData.password && passwordErrors.length === 0;

    return (
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)" }} 
             className="min-h-screen bg-gradient-to-r from-slate-100 to-white flex items-center justify-center bg-center bg-cover py-4">
            <div className="bg-white mt-[4rem] p-8 rounded-lg w-[95%] lg:w-[40%] mx-auto shadow-2xl">
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center mb-3">
                        <div className="p-2 rounded w-[200px]">
                            <img src={logo} alt="LMS Logo" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Reset Password</h1>
                    <p className="text-gray-500 mt-2">Create a new secure password</p>
                </div>

                <MessageAlert response={response} onClose={() => setResponse(null)} />

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-sm font-medium text-gray-700">New Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                required
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="p-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                placeholder="Enter new password"
                                disabled={loading}
                                isInvalid={validated && (!formData.password || passwordErrors.length > 0)}
                            />
                            <Button
                                variant="link"
                                onClick={() => setShowPassword(!showPassword)}
                                className="position-absolute end-0 top-50 translate-middle-y text-gray-500"
                                style={{ textDecoration: 'none' }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {formData.password && (
                            <div className="mt-2">
                                <div className="flex items-center gap-2 text-xs">
                                    <Shield size={12} className={isPasswordValid ? "text-green-500" : "text-gray-400"} />
                                    <span className={isPasswordValid ? "text-green-600" : "text-gray-500"}>
                                        {isPasswordValid ? "Strong password!" : "Password requirements:"}
                                    </span>
                                </div>
                                {!isPasswordValid && (
                                    <ul className="mt-1 text-xs text-gray-500 list-disc list-inside">
                                        {passwordErrors.map((error, idx) => (
                                            <li key={idx}>{error}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-4">
                        <Form.Label className="text-sm font-medium text-gray-700">Confirm Password</Form.Label>
                        <div className="position-relative">
                            <Form.Control
                                required
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="p-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                                placeholder="Confirm new password"
                                disabled={loading}
                                isInvalid={validated && formData.confirmPassword && formData.password !== formData.confirmPassword}
                            />
                            <Button
                                variant="link"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="position-absolute end-0 top-50 translate-middle-y text-gray-500"
                                style={{ textDecoration: 'none' }}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </Button>
                        </div>
                        {validated && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <Form.Text className="text-danger">Passwords do not match</Form.Text>
                        )}
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="success"
                        className="w-full py-3 rounded-lg flex justify-center items-center gap-2 mb-4"
                    >
                        <Lock size={18} />
                        {loading ? "Resetting..." : "Reset Password"}
                    </Button>

                    <div className="text-center">
                        <Link to="/login" className="text-green-600 hover:text-green-700 flex items-center justify-center gap-1 text-sm">
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}