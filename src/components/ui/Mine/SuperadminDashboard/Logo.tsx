import Link from "next/link";

export function Logo() {
    return (
      <Link href="/dashboard/superadmin" className="flex items-center gap-2 p-4">
        <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold">C</span>
        </div>
        <span className="font-semibold text-xl">CyberForTech</span>
      </Link>
    );
   }
   