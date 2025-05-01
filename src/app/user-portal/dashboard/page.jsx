
import AttendanceTracker from "@/components/dashboard/user/attendance-tracker";
import EmployeeInfo from "@/components/dashboard/user/employee-info";
import Announcements from "@/components/dashboard/user/announcement";
import LeaveStatus from "@/components/dashboard/user/leave-status";

const Dashboard = () => {
 
    return (
        <div className="flex items-center justify-center w-full h-full gap-8">
        <div className="flex flex-col gap-8 justify-between">
           <AttendanceTracker />
           <Announcements />
        </div>
        <div className="flex flex-col gap-8 justify-between">
           <EmployeeInfo />
           <LeaveStatus />
        </div>
            
        </div>
    )
}

export default Dashboard;