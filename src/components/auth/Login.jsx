import { BookOpen, LogIn } from "lucide-react";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext.jsx";
import { useAuth } from "../../contexts/AuthContext.jsx";
import PasswordInput from "../../components/auth/PasswordInput";
import MessageAlert from "../../components/auth/MessageAlert";
import logo from "@/resources/logo.png";
import { ROUTES } from "@/utils/routes.js";

export default function Login() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const { start, complete } = useTopLoader();
    const { login } = useAuth();

    const [formData, setForm] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    async function handleSubmit(e) {
        setLoading(true);
        e.preventDefault();

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setLoading(false);
            setValidated(true);
            let emptyKey = Object.keys(formData).find(key =>
                (["email", "password"].includes(key)) && formData[key].trim() === ""
            );
            emptyKey = emptyKey === "email" ? "email address" : emptyKey;
            setResponse({ success: false, message: `Please enter your ${emptyKey}` });
            return;
        }

        try {
            start();
            const form = new URLSearchParams();
            form.append('email', formData?.email);
            form.append('password', formData?.password);
            form.append('remember-me', formData?.rememberMe);

            const result = await login({ "form": form });
            setResponse(result);

            if (result?.success) {
                setForm({ email: "", password: "", rememberMe: false });
                setTimeout(() => setResponse(null), 15000);

                const url = getDashboardPath(result?.payload?.role[0]);
                navigate(url);
            }
        } catch (error) {
            setResponse({ success: false, message: "An error occurred. Please try again later." });
        } finally {
            setLoading(false);
            complete();
        }
    }

    function getDashboardPath(role) {
        switch (role) {
            case "ADMIN": return "/user/admin";
            case "LEARNER": return "/user/learner";
            case "FACILITATOR": return "/user/facilitator";
            case "ASSESSOR": return "/user/assessor";
            case "MODERATOR": return "/user/moderator";
            case "MENTOR": return "/user/mentor";
            case "PROGRAM_MANAGER": return "/user/program-manager";
            default: return "/user/intern";
        }
    }

    return (
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)" }} className="min-h-screen bg-gradient-to-r from-slate-100 to-white flex items-center justify-center bg-center bg-cover py-4">
            <div className="bg-white mt-[4rem] p-8 rounded-lg w-[95%] lg:w-[40%] mx-auto">
                {/* Header */}
                <div className="text-center mb-6">

                    <div className="flex items-center justify-center  space-x-3 mb-3">
                        <div className=" p-2 rounded w-[200px]">
                            <img src={logo} alt="LMS Logo" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
                    <p className="text-gray-600">Sign in to your LMS account</p>
                </div>

                {/* Message Alert */}
                <MessageAlert response={response} onClose={() => setResponse(null)} />

                {/* Form */}
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="space-y-4">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <Form.Control
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border-gray-300  "
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Password */}
                    <PasswordInput
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        label="Password"
                    />

                    {/* Remember Me */}
                    <div className="mb-3">
                        <Form.Check
                            type="checkbox"
                            name="rememberMe"
                            label="Remember me"
                            checked={formData?.rememberMe}
                            onChange={handleChange}
                            className="text-gray-700 cursor-pointer"
                        />
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="submit"
                        disabled={loading}
                        variant="success"
                        className="w-full  text-white py-3 rounded-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                    >
                        <LogIn className="w-5 h-5" />
                        {loading ? "Signing in..." : "Sign In"}
                    </Button>

                    {/* Footer Links */}
                    <div className="text-center space-y-2">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="text-sky-600 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}