import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "./layout.css";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => (
  <>
    <Header />
    <main className="app-main">{children}</main>
    <Footer />
  </>
);

export default AppLayout;
