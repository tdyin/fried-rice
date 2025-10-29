import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Database } from "@/lib/database.types";

type InterviewExperience = Database["public"]["Tables"]["interview_experiences"]["Row"];

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: InterviewExperience | null;
  editForm: Partial<InterviewExperience>;
  onFormChange: (form: Partial<InterviewExperience>) => void;
  onSave: () => void;
}

export function EditDialog({
  open,
  onOpenChange,
  submission,
  editForm,
  onFormChange,
  onSave,
}: EditDialogProps) {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
          <DialogDescription>Make changes to the submission</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit_student_name">Student Name</Label>
              <Input
                id="edit_student_name"
                value={editForm.student_name || ""}
                onChange={(e) =>
                  onFormChange({ ...editForm, student_name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_linkedin_url">LinkedIn URL</Label>
              <Input
                id="edit_linkedin_url"
                value={editForm.linkedin_url || ""}
                onChange={(e) =>
                  onFormChange({ ...editForm, linkedin_url: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_company">Company</Label>
              <Input
                id="edit_company"
                value={editForm.company || ""}
                onChange={(e) =>
                  onFormChange({ ...editForm, company: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_position">Position</Label>
              <Input
                id="edit_position"
                value={editForm.position || ""}
                onChange={(e) =>
                  onFormChange({ ...editForm, position: e.target.value })
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_questions">Interview Questions</Label>
            <Textarea
              id="edit_questions"
              value={editForm.interview_questions || ""}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  interview_questions: e.target.value,
                })
              }
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_advice">Advice & Tips</Label>
            <Textarea
              id="edit_advice"
              value={editForm.advice_tips || ""}
              onChange={(e) =>
                onFormChange({ ...editForm, advice_tips: e.target.value })
              }
              className="min-h-[150px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit_status">Status</Label>
            <select
              id="edit_status"
              value={editForm.status || "pending"}
              onChange={(e) =>
                onFormChange({
                  ...editForm,
                  status: e.target.value as "pending" | "approved" | "rejected",
                })
              }
              className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
