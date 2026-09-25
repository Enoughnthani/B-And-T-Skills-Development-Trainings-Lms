import { Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";
import Header from "../header/Header";
import Footer from "../footer/Footer";

export default function PublicLayout() {
  return (
    <Container fluid className="p-0 bg-gradient-to-r from-slate-100 to-white">
      <Header />
      <Outlet />
      <Footer />
    </Container>
  );
};

