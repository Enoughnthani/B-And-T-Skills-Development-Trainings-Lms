import { KeyRound, ArrowLeft, RefreshCw, Clock } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext.jsx";
import MessageAlert from "./MessageAlert.jsx";
import logo from "@/resources/logo.png";
import { apiFetch } from "@/api/api.js";

export default function VerifyOTP() {
    const navigate = useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(120);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef([]);
    const { start, complete } = useTopLoader();

    useEffect(() => {
        const email = sessionStorage.getItem('resetEmail');
        const timestamp = sessionStorage.getItem('resetTimestamp');
        
        if (!email || !timestamp) {
            navigate('/forgot-password');
            return;
        }

        const elapsed = Math.floor((Date.now() - parseInt(timestamp)) / 1000);
        if (elapsed > 300) {
            sessionStorage.removeItem('resetEmail');
            sessionStorage.removeItem('resetTimestamp');
            navigate('/forgot-password');
            return;
        }

        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate]);

    const handleOtpChange = useCallback((index, value) => {
        if (value.length > 1) return;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1].focus();
        }

        if (response) setResponse(null);
    }, [otp, response]);

    const handleKeyDown = useCallback((index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    }, [otp]);

    const handlePaste = useCallback((e) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text');
        const digits = pastedData.replace(/\D/g, '').slice(0, 6);
        
        if (digits.length > 0) {
            const newOtp = [...otp];
            for (let i = 0; i < digits.length; i++) {
                if (i < 6) newOtp[i] = digits[i];
            }
            setOtp(newOtp);
            
            const lastFilledIndex = Math.min(digits.length - 1, 5);
            if (lastFilledIndex >= 0 && lastFilledIndex < 5) {
                inputRefs.current[lastFilledIndex + 1]?.focus();
            } else if (digits.length === 6) {
                inputRefs.current[5]?.focus();
            }
            
            if (response) setResponse(null);
            
            if (digits.length === 6) {
                setTimeout(() => {
                    const submitEvent = new Event('submit', { bubbles: true });
                    e.target.closest('form')?.dispatchEvent(submitEvent);
                }, 100);
            }
        }
    }, [otp, response]);

    const handleResendOTP = useCallback(async () => {
        const email = sessionStorage.getItem('resetEmail');
        if (!email || !canResend) return;

        setResendLoading(true);
        try {
            const payload = { email };
            const data = await apiFetch('/api/auth/forgot_password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        

            if (data.success) {
                setResponse({ success: true, message: "New OTP sent successfully" });
                setTimer(120);
                setCanResend(false);
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
                
                const interval = setInterval(() => {
                    setTimer(prev => {
                        if (prev <= 1) {
                            clearInterval(interval);
                            setCanResend(true);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            } else {
                setResponse({ success: false, message: data.message || "Failed to resend OTP" });
            }
        } catch (error) {
            setResponse({ success: false, message: "Network error. Please try again." });
        } finally {
            setResendLoading(false);
        }
    }, [canResend]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const otpValue = otp.join('');
        
        if (otpValue.length !== 6) {
            setResponse({ success: false, message: "Please enter the complete 6-digit OTP" });
            return;
        }

        setLoading(true);
        try {
            start();
            const email = sessionStorage.getItem('resetEmail');
            const payload = { email, otp: otpValue };

            const data = await apiFetch('/api/auth/verify_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (data.success) {
                navigate('/reset-password');
            } else {
                setResponse({ success: false, message: data.message || "Invalid OTP. Please try again." });
                setOtp(["", "", "", "", "", ""]);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            setResponse({ success: false, message: "Network error. Please try again." });
        } finally {
            setLoading(false);
            complete();
        }
    }, [otp, navigate, start, complete]);

    const formatTime = useCallback((seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }, []);

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
                    <h1 className="text-3xl font-bold text-gray-800">Verify OTP</h1>
                    <p className="text-gray-500 mt-2">Enter the 6-digit code sent to your email</p>
                </div>

                <MessageAlert response={response} onClose={() => setResponse(null)} />

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-6">
                        <Form.Label className="text-sm font-medium text-gray-700 text-center d-block">
                            Verification Code
                        </Form.Label>
                        <div className="flex justify-center gap-3 my-4" onPaste={handlePaste}>
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    ref={el => inputRefs.current[index] = el}
                                    type="text"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleOtpChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    className="w-12 h-12 text-center text-2xl font-bold border-2 rounded-lg focus:border-green-500 focus:ring-green-500"
                                    disabled={loading}
                                    autoFocus={index === 0}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 text-center mt-2">
                            💡 Tip: You can copy and paste the entire OTP
                        </p>
                    </Form.Group>

                    <Button
                        type="submit"
                        disabled={loading}
                        variant="success"
                        className="w-full py-3 rounded-lg flex justify-center items-center gap-2 mb-4"
                    >
                        <KeyRound size={18} />
                        {loading ? "Verifying..." : "Verify OTP"}
                    </Button>

                    <div className="flex justify-between items-center text-sm">
                        <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700 flex items-center gap-1">
                            <ArrowLeft size={14} />
                            Back
                        </Link>
                        
                        <div className="flex items-center gap-2">
                            {timer > 0 ? (
                                <span className="text-gray-500 flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatTime(timer)}
                                </span>
                            ) : (
                                <Button
                                    variant="link"
                                    onClick={handleResendOTP}
                                    disabled={resendLoading || !canResend}
                                    className="text-green-600 hover:text-green-700 p-0 flex items-center gap-1"
                                >
                                    <RefreshCw size={14} className={resendLoading ? "animate-spin" : ""} />
                                    {resendLoading ? "Sending..." : "Resend OTP"}
                                </Button>
                            )}
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}