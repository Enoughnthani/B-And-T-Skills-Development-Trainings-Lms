import { Mail, ArrowLeft, Send } from "lucide-react";
import { useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext.jsx";
import MessageAlert from "../../components/auth/MessageAlert";
import logo from "@/resources/logo.png";
import { apiFetch } from "@/api/api.js";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const { start, complete } = useTopLoader();
    const [formData, setForm] = useState({ email: "" });

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (response) setResponse(null);
    }, [response]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setLoading(true);

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setValidated(true);
            setResponse({ success: false, message: "Please enter your email address" });
            setLoading(false);
            return;
        }

        try {
            start();
            const payload = { email: formData.email };
            const data = await apiFetch('/api/auth/forgot_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            

            if (data.success) {
                sessionStorage.setItem('resetEmail', formData.email);
                sessionStorage.setItem('resetTimestamp', Date.now().toString());
                navigate('/verify-otp');
            } else {
                setResponse({ success: false, message: data.message || "Email not found" });
            }
        } catch (error) {
            setResponse({ success: false, message: "Network error. Please try again." });
        } finally {
            setLoading(false);
            complete();
        }
    }, [formData.email, navigate, start, complete]);

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
                    <h1 className="text-3xl font-bold text-gray-800">Forgot Password?</h1>
                    <p className="text-gray-500 mt-2">Enter your email to receive a verification code</p>
                </div>

                <MessageAlert response={response} onClose={() => setResponse(null)} />

                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Form.Group className="mb-4">
                        <Form.Label className="text-sm font-medium text-gray-700">Email Address</Form.Label>
                        <Form.Control
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="p-3 rounded-lg border-gray-300 focus:border-green-500 focus:ring-green-500"
                            placeholder="name@example.com"
                            disabled={loading}
                        />
                        <Form.Control.Feedback type="invalid">
                            Please enter a valid email address
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="success"
                        className="w-full py-3 rounded-lg flex justify-center items-center gap-2 mb-4"
                    >
                        <Send size={18} />
                        {loading ? "Sending..." : "Send OTP"}
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