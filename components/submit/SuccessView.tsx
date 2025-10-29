import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

interface SuccessViewProps {
  onSubmitAnother: () => void;
}

export function SuccessView({ onSubmitAnother }: SuccessViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 dark:border-green-900">
          <CardHeader>
            <CardTitle className="text-green-600 dark:text-green-400">
              Submission Received!
            </CardTitle>
            <CardDescription>
              Thank you for sharing your interview experience. Your submission will be reviewed and published soon.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your entry is now pending review. Once approved, it will be visible to other students searching for interview insights.
            </p>
            <div className="flex gap-3">
              <Button onClick={onSubmitAnother}>
                Submit Another Experience
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">View Experiences</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
