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
import { useState } from "react";

type InterviewExperience =
  Database["public"]["Tables"]["interview_experiences"]["Row"];

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
  const [newDateLabel, setNewDateLabel] = useState("");
  const [newDateValue, setNewDateValue] = useState("");

  if (!submission) return null;

  const interviewDates = editForm.interview_dates || [];

  const handleAddDate = () => {
    if (!newDateLabel.trim() || !newDateValue) return;

    const updatedDates = [
      ...interviewDates,
      { label: newDateLabel, date: newDateValue },
    ];
    onFormChange({ ...editForm, interview_dates: updatedDates });
    setNewDateLabel("");
    setNewDateValue("");
  };

  const handleRemoveDate = (index: number) => {
    const updatedDates = interviewDates.filter((_, i) => i !== index);
    onFormChange({ ...editForm, interview_dates: updatedDates });
  };

  const handleMoveDate = (index: number, direction: "up" | "down") => {
    const updatedDates = [...interviewDates];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= updatedDates.length) return;

    [updatedDates[index], updatedDates[newIndex]] = [
      updatedDates[newIndex],
      updatedDates[index],
    ];

    onFormChange({ ...editForm, interview_dates: updatedDates });
  };

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
            <Label>Timeline</Label>
            <div className="space-y-3">
              {interviewDates.map((dateEntry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium">{dateEntry.label}:</span>{" "}
                    <span className="text-gray-600 dark:text-gray-400">
                      {new Date(dateEntry.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDate(index, "up")}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMoveDate(index, "down")}
                      disabled={index === interviewDates.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveDate(index)}
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="space-y-2">
                <Label htmlFor="new_date_label">Date Label</Label>
                <Input
                  id="new_date_label"
                  value={newDateLabel}
                  onChange={(e) => setNewDateLabel(e.target.value)}
                  placeholder="e.g., Applied, Phone Screen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new_date_value">Date</Label>
                <Input
                  id="new_date_value"
                  type="date"
                  value={newDateValue}
                  onChange={(e) => setNewDateValue(e.target.value)}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={handleAddDate}
              disabled={!newDateLabel.trim() || !newDateValue}
              className="w-full"
            >
              + Add Date
            </Button>
          </div>
          <div className="space-y-2">
            <Label>Interview Details</Label>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-2">
                <Label htmlFor="edit_phone_screens">Phone Screens</Label>
                <Input
                  id="edit_phone_screens"
                  type="number"
                  min="0"
                  value={editForm.phone_screens ?? 0}
                  onChange={(e) =>
                    onFormChange({
                      ...editForm,
                      phone_screens: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_technical">Technical</Label>
                <Input
                  id="edit_technical"
                  type="number"
                  min="0"
                  value={editForm.technical_interviews ?? 0}
                  onChange={(e) =>
                    onFormChange({
                      ...editForm,
                      technical_interviews: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_behavioral">Behavioral</Label>
                <Input
                  id="edit_behavioral"
                  type="number"
                  min="0"
                  value={editForm.behavioral_interviews ?? 0}
                  onChange={(e) =>
                    onFormChange({
                      ...editForm,
                      behavioral_interviews: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_other">Other</Label>
                <Input
                  id="edit_other"
                  type="number"
                  min="0"
                  value={editForm.other_interviews ?? 0}
                  onChange={(e) =>
                    onFormChange({
                      ...editForm,
                      other_interviews: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
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
