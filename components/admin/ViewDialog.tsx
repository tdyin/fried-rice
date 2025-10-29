import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Database } from "@/lib/database.types";

type InterviewExperience = Database["public"]["Tables"]["interview_experiences"]["Row"];

interface ViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: InterviewExperience | null;
}

export function ViewDialog({ open, onOpenChange, submission }: ViewDialogProps) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View Submission</DialogTitle>
          <DialogDescription>Full details of the submission</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Student Name</Label>
              <p className="text-sm mt-1">{submission.student_name}</p>
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <a
                href={submission.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline mt-1 block"
              >
                View Profile
              </a>
            </div>
            <div>
              <Label>Company</Label>
              <p className="text-sm mt-1">{submission.company}</p>
            </div>
            <div>
              <Label>Position</Label>
              <p className="text-sm mt-1">{submission.position}</p>
            </div>
          </div>
          <div>
            <Label>Timeline</Label>
            {submission.interview_dates && submission.interview_dates.length > 0 ? (
              <div className="mt-2 space-y-1">
                {submission.interview_dates.map((dateEntry, idx) => (
                  <p key={idx} className="text-sm">
                    <span className="font-medium">{dateEntry.label}:</span>{" "}
                    {new Date(dateEntry.date).toLocaleDateString()}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-sm mt-1 text-gray-500">No dates provided</p>
            )}
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <Label>Phone Screens</Label>
              <p className="text-sm mt-1">{submission.phone_screens}</p>
            </div>
            <div>
              <Label>Technical</Label>
              <p className="text-sm mt-1">{submission.technical_interviews}</p>
            </div>
            <div>
              <Label>Behavioral</Label>
              <p className="text-sm mt-1">{submission.behavioral_interviews}</p>
            </div>
            <div>
              <Label>Other</Label>
              <p className="text-sm mt-1">{submission.other_interviews}</p>
            </div>
          </div>
          <div>
            <Label>Interview Questions</Label>
            <p className="text-sm mt-1 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded">
              {submission.interview_questions}
            </p>
          </div>
          <div>
            <Label>Advice & Tips</Label>
            <p className="text-sm mt-1 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded">
              {submission.advice_tips}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
