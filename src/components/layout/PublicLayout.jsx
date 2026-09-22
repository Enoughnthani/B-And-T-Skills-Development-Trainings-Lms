import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { Container } from "react-bootstrap";

export default function PublicLayout(){
  return (
    <Container fluid className="p-0 bg-gradient-to-r from-slate-100 to-white">
      <Header />
      <Outlet />  
      <Footer />
    </Container>
  );
};

