import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface EmptyStateProps {
  hasExperiences: boolean;
}

export function EmptyState({ hasExperiences }: EmptyStateProps) {
  return (
    <Card>
      <CardContent className="py-12 text-center">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {!hasExperiences
            ? "No experiences have been published yet."
            : "No experiences match your search criteria."}
        </p>
        <Button asChild variant="outline">
          <Link href="/submit">Be the first to share!</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
