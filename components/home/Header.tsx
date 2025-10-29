import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Header() {
  return (
    <header className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🍘 Fried Rice
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Student-shared interview insights
          </p>
        </div>
        <Button asChild>
          <Link href="/submit">Share Your Experience</Link>
        </Button>
      </div>
    </header>
  );
}
