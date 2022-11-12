import React, { ReactNode } from "react";
import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";

interface Props {
  children: ReactNode;
}

const UserLayout: React.FC<Props> = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
};

export default UserLayout;
