"use client";

import { usePathname } from "next/navigation";
import Header from "../../components/layouts/user/header/header";
import Footer from "../../components/layouts/user/footer";
import Sidebar from "../../components/layouts/user/sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";

const MainsLayoutContent = ({ children }) => {
  return (
    <>
      <div>
        <div className="h-[7vh]">
          <Header />
        </div>
        <div className="h-[86vh] flex">
          <div className="w-[15vw] xl:w-[19vw] 2xl:w-[16vw] h-full">
            <Sidebar />
          </div>
          <div className="w-[85vw] xl:w-[81vw] 2xl:w-[84vw] h-full">
            {children}
          </div>
        </div>
        <div className="h-[7vh]">
          <Footer />
        </div>
      </div>
    </>
  );
};

const MainsLayout = ({ children }) => {
  const pathname = usePathname();

  const unprotectedRoutes = [
    "/guest-register",
    "/guest-recognition",
    "/face-register",
    "/face-recognition",
  ];

  const isUnprotected = unprotectedRoutes.includes(pathname);

  return isUnprotected ? children : <ProtectedRoute><MainsLayoutContent>{children}</MainsLayoutContent></ProtectedRoute>;
};

export default MainsLayout;
