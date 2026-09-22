import { BookOpen, UserPlus } from "lucide-react";
import { useState } from "react";
import { Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useTopLoader } from "../../contexts/TopLoaderContext.jsx";
import { isValidSouthAfricanID } from "../../utils/validateIdNo.js";
import { CREATE_ACCOUNT } from "@/utils/apiEndpoint.js";
import PasswordInput from "./PasswordInput.jsx";
import MessageAlert from "./MessageAlert.jsx";
import { apiFetch } from "@/api/api.js";
import logo from "@/resources/logo.png";


export default function Register() {
    const navigate = useNavigate();
    const [validated, setValidated] = useState(false);
    const [passwordDontMatch, setPasswordDontMatch] = useState(false);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [invalidIdNo, setInvalidIdNo] = useState(false);
    const { start, complete } = useTopLoader();

    const [formData, setForm] = useState({
        firstname: "",
        lastname: "",
        contactNumber: "",
        email: "",
        idNo: "",
        password: "",
        confirmPassword: "",
        role: ["LEARNER"]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Contact number validation
        if (name === "contactNumber" && value !== "") {
            if (!/^\d*$/.test(value) || value.length > 10 || (value.length > 0 && value[0] !== "0")) return;
        }

        setForm({ ...formData, [name]: value });

        // Password match validation
        if (name === "confirmPassword" || name === "password") {
            if (name === "password") {
                if (value !== formData.confirmPassword && formData.confirmPassword !== "") {
                    setPasswordDontMatch(true);
                } else {
                    setPasswordDontMatch(false);
                }
            } else {
                if (value !== formData.password) {
                    setPasswordDontMatch(true);
                } else {
                    setPasswordDontMatch(false);
                }
            }
        }

        // ID validation
        if (name === "idNo") {
            if (value.length === 13 && !isValidSouthAfricanID(value)) {
                setResponse({ success: false, message: "Invalid ID number." });
                setInvalidIdNo(true);
            } else {
                setResponse(null);
                setInvalidIdNo(false);
            }
        }
    };

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);

        if (e.currentTarget.checkValidity() === false) {
            e.stopPropagation();
            setLoading(false);
            setValidated(true);
            let emptyKey = Object.keys(formData).find(key => formData[key]?.toString().trim() === "");
            emptyKey = emptyKey === "idNo" ? "Identification number" : emptyKey;
            setResponse({ success: false, message: `${emptyKey} is required!` });
            return;
        }

        if (invalidIdNo || passwordDontMatch) {
            setLoading(false);
            setValidated(false);
            return;
        }

        try {
            start();
            const result = await apiFetch(CREATE_ACCOUNT, {
                method: "POST",
                body: formData,
                redirectErrors: false
            });

            setResponse(result);

            if (result?.success) {
                setForm({
                    firstname: "",
                    lastname: "",
                    contactNumber: "",
                    email: "",
                    idNo: "",
                    password: "",
                    confirmPassword: "",
                    role: ["LEARNER"]
                });

                setTimeout(() => {
                    setResponse(null);
                    navigate("/login");
                }, 3000);
            }
        } catch (error) {
            setResponse({ success: false, message: "An error occurred. Please try again later." });
        } finally {
            complete();
            setLoading(false);
        }
    }

    return (
        <div style={{ backgroundImage: "url(https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)" }} className="min-h-screen bg-gradient-to-r from-slate-100 to-white flex items-center justify-center bg-cover bg-center py-4">
            <div className="bg-white mt-[4rem] p-8 rounded-lg w-[95%] lg:w-[50%] mx-auto shadow-lg">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex items-center justify-center  space-x-3 mb-3">
                        <div className=" p-2 rounded w-[200px]">
                            <img src={logo} alt="LMS Logo" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-black">Create an Account</h1>
                    <p className="text-gray-600">Register to start your learning journey</p>
                </div>

                {/* Message Alert */}
                <MessageAlert response={response} onClose={() => setResponse(null)} />

                {/* Password Match Error */}
                {passwordDontMatch && (
                    <p className="text-center text-red-600 bg-red-100 rounded mx-auto font-bold my-2 p-2">
                        Passwords do not match
                    </p>
                )}

                {/* Form */}
                <Form noValidate validated={validated} onSubmit={handleSubmit} className="space-y-4">
                    {/* Name Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                First Name
                            </label>
                            <Form.Control
                                required
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-gray-300  "
                                placeholder="Enter your first name"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last Name
                            </label>
                            <Form.Control
                                required
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-gray-300  "
                                placeholder="Enter your last name"
                            />
                        </div>
                    </div>

                    {/* Contact & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Contact Number
                            </label>
                            <Form.Control
                                required
                                type="text"
                                maxLength={10}
                                name="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-gray-300  "
                                placeholder="0123456789"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <Form.Control
                                required
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 rounded-lg border-gray-300  "
                                placeholder="someone@gmail.com"
                            />
                        </div>
                    </div>

                    {/* ID Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Identification Number (RSA ID)
                        </label>
                        <Form.Control
                            required
                            type="text"
                            name="idNo"
                            value={formData.idNo}
                            maxLength={13}
                            onChange={handleChange}
                            className="w-full p-3 rounded-lg border-gray-300  "
                            placeholder="Enter your 13-digit ID number"
                            isInvalid={invalidIdNo}
                        />
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <PasswordInput
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Create a password"
                            label="Password"
                            isInvalid={passwordDontMatch}
                        />
                        <PasswordInput
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirm your password"
                            label="Confirm Password"
                            isInvalid={passwordDontMatch}
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex justify-center items-center gap-2 transition-all disabled:opacity-50 mt-6"
                    >
                        <UserPlus className="w-5 h-5" />
                        {loading ? "Creating account..." : "Register"}
                    </button>

                    {/* Footer */}
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{" "}
                        <Link to="/login" className="text-red-600 hover:underline">
                            Login here
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
}