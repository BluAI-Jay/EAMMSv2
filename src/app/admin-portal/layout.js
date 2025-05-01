"use client";
import Header from "../../components/layouts/admin/header";
import { usePathname } from "next/navigation";
import Footer from "../../components/layouts/admin/footer";
import Sidebar from "../../components/layouts/admin/sidebar";
import AdminProtectedRoute from "../../components/AdminProtectedRoute";


const AdminMainsLayoutContent = ({children}) => {

    return (
        <>
            <div>
                <div className="h-[7vh]">
                    <Header />
                </div>
                <div className="h-[86vh] flex">
                    <div className="w-[15vw] xl:w-[19vw] 2xl:w-[17vw] h-full">
                        <Sidebar />
                    </div> 
                    <div className="w-[85vw] xl:w-[81vw] 2xl:w-[83vw] h-full">
                        {children}
                    </div>
                </div>
                <div className="h-[7vh]">
                    <Footer />
                </div>
            </div>
        </>
    )
};


const AdminMainsLayout = ({ children }) => {
    const pathname = usePathname();
  
    const unprotectedRoutes = [
      "/update-password",
    ];
  
    const isUnprotected = unprotectedRoutes.includes(pathname);
  
    return isUnprotected ? children : <AdminProtectedRoute><AdminMainsLayoutContent>{children}</AdminMainsLayoutContent></AdminProtectedRoute>;
  };

export default AdminMainsLayout;