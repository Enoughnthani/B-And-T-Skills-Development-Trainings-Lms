import { Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";
import logo from "@/resources/logo.png";
import { FaFacebook, FaWhatsapp } from "react-icons/fa";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-slate-50 text-black py-12">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10">

                <div>
                    <div>
                        <div className="flex items-center  space-x-3 mb-3">
                            <div className=" p-2 rounded w-[200px]">
                                <img src={logo} alt="LMS Logo" />
                            </div>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your Learning Management System built for students, teachers, and digital learning.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-black mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/privacy" className="hover:text-red-500 transition">Privacy</Link></li>
                            <li><Link to="/policy" className="hover:text-red-500 transition">Policy</Link></li>
                            <li><Link to="/login" className="hover:text-red-500 transition">Login</Link></li>
                            <li><Link to="/help" className="hover:text-red-500 transition">Help</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-black mb-3">Contact Us</h3>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-center space-x-2">
                                <Phone className="w-4 h-4" />
                                <span>011 568 0486 / 068 552 4477</span>
                            </li>
                            <li className="flex items-center space-x-2">
                                <Mail className="w-4 h-4" />
                                <span>support@lms.com</span>
                            </li>
                        </ul>

                        {/* Social Icons */}
                        <div className="flex space-x-4 mt-4">

                            {
                                [
                                    {
                                        icon: Linkedin,
                                        color: "text-blue-600",
                                        href: "#"
                                    },

                                    {
                                        icon: Facebook,
                                        color: "text-blue-600",
                                        href: "#"
                                    },

                                    {
                                        icon: Instagram,
                                        color: "text-blue-600",
                                        href: "#"
                                    },

                                    {
                                        icon: FaWhatsapp,
                                        color: "text-green-600",
                                        href: "#"
                                    }
                                ].map((item, index) => (
                                    <a key={index} href={item.href} className={`${item.color} transition`}>
                                        <item.icon className="w-5 h-5" />
                                    </a>
                                ))}

                        </div>
                    </div>

                    <div className="py-3">
                        <p className="text-gray-500 text-xs">
                            © {new Date().getFullYear()} LMS — All Rights Reserved.
                        </p>
                    </div>
                </div>


                <div>
                    <h3 className="text-lg font-semibold text-black mb-4">
                        Send Us Feedback
                    </h3>

                    <form className="space-y-4">


                        <Form.Control
                            type="text"
                            placeholder="Your Name"
                            className="w-full p-3 rounded-lg  "
                            required
                        />

                        <Form.Control
                            type="email"
                            placeholder="Your Email"
                            className="w-full p-3 rounded-lg  "
                            required
                        />

                        <Form.Control
                            as="textarea"
                            rows="4"
                            placeholder="Write your message..."
                            className="w-full p-3 rounded-lg  "
                            required
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            className="w-full py-2 font-bold "
                        >
                            Send
                        </Button>
                    </form>
                </div>

            </div>
        </footer>
    );
}


