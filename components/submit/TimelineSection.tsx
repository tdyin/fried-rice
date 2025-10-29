import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TimelineSectionProps {
  interviewDates: Array<{ label: string; date: string }>;
  newDateLabel: string;
  setNewDateLabel: (value: string) => void;
  newDateValue: string;
  setNewDateValue: (value: string) => void;
  onAddDate: () => void;
  onRemoveDate: (index: number) => void;
  onMoveDate: (index: number, direction: "up" | "down") => void;
}

export function TimelineSection({
  interviewDates,
  newDateLabel,
  setNewDateLabel,
  newDateValue,
  setNewDateValue,
  onAddDate,
  onRemoveDate,
  onMoveDate,
}: TimelineSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>
          Add important dates in your interview process (Optional)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
                  onClick={() => onMoveDate(index, "up")}
                  disabled={index === 0}
                >
                  ↑
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onMoveDate(index, "down")}
                  disabled={index === interviewDates.length - 1}
                >
                  ↓
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDate(index)}
                >
                  ✕
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="new_date_label">Date Label</Label>
            <Input
              id="new_date_label"
              value={newDateLabel}
              onChange={(e) => setNewDateLabel(e.target.value)}
              placeholder="e.g., Applied, Phone Screen, Final Round"
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
          onClick={onAddDate}
          disabled={!newDateLabel.trim() || !newDateValue}
          className="w-full"
        >
          + Add Date
        </Button>
      </CardContent>
    </Card>
  );
}
