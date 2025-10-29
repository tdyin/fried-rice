import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

interface AdminHeaderProps {
  onExport: () => void;
  onLogout: () => void;
}

export function AdminHeader({ onExport, onLogout }: AdminHeaderProps) {
  return (
    <header className="border-b bg-white dark:bg-black sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🧑‍🍳 Rice Cooker
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Manage interview experience submissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" asChild>
            <Link href="/">Public View</Link>
          </Button>
          <Button variant="outline" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button variant="destructive" onClick={onLogout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
