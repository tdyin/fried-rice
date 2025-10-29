import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormRegister } from "react-hook-form";

interface InterviewDetailsSectionProps {
  register: UseFormRegister<any>;
}

export function InterviewDetailsSection({ register }: InterviewDetailsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Details</CardTitle>
        <CardDescription>
          How many of each type of interview did you have?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone_screens">Phone Screens</Label>
            <Input
              id="phone_screens"
              type="number"
              min="0"
              {...register("phone_screens", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="technical_interviews">Technical Interviews</Label>
            <Input
              id="technical_interviews"
              type="number"
              min="0"
              {...register("technical_interviews", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="behavioral_interviews">Behavioral Interviews</Label>
            <Input
              id="behavioral_interviews"
              type="number"
              min="0"
              {...register("behavioral_interviews", { valueAsNumber: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="other_interviews">Other Interviews</Label>
            <Input
              id="other_interviews"
              type="number"
              min="0"
              {...register("other_interviews", { valueAsNumber: true })}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
