import { useAuth } from "@/hooks/useAuth";
import { UserButton } from "@clerk/nextjs";

export function DashboardHeader() {
    const { user } = useAuth();
    
    return (
      <header className="bg-white dark:bg-neutral-800 shadow-sm p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-center w-full">Super Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            {/* <UserButton /> */}
          </div>
        </div>
      </header>
    );
   }
   