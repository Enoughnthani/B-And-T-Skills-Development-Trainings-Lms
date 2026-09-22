import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@/resources/logo.png";
import { Button } from "react-bootstrap";
import { Home, LogIn } from "lucide-react";
import { BsPersonAdd } from "react-icons/bs";

export default function Header() {

    const location = useLocation()
    const navigate = useNavigate()


    return (
        <header className="fixed top-0 left-0 right-0  z-50 w-full">
            <div className="flex justify-end items-center py-1 px-2 md:px-4">

                {/* Auth Buttons */}
                <div className="flex items-center gap-3">

                    <Button
                        onClick={() => navigate('/')}
                        variant="light"
                        className="flex gap-2 font-medium items-center justify-center" >
                        <Home size={20} />
                        Home
                    </Button>



                    <Button
                        onClick={() => navigate('login')}
                        className="flex font-medium gap-2 items-center justify-center"
                    >

                        <LogIn size={20} />
                        Login
                    </Button>
                </div>
            </div>
        </header>
    );
}