import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
/* eslint-disable @typescript-eslint/no-explicit-any */

interface PersonalInfoSectionProps {
  register: any;
  errors: any;
  isAnonymous?: boolean;
  onAnonymousChange?: (checked: boolean) => void;
}

export function PersonalInfoSection({
  register,
  errors,
  isAnonymous,
  onAnonymousChange,
}: PersonalInfoSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Your name and LinkedIn profile will be visible to other students
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="student_name">Student Name *</Label>
          <Input
            id="student_name"
            {...register("student_name")}
            placeholder="John Doe"
          />
          {errors.student_name && (
            <p className="text-sm text-red-600">
              {errors.student_name.message?.toString()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL *</Label>
          <Input
            id="linkedin_url"
            {...register("linkedin_url")}
            placeholder="https://linkedin.com/in/johndoe"
            type="url"
          />
          {errors.linkedin_url && (
            <p className="text-sm text-red-600">
              {errors.linkedin_url.message?.toString()}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Checkbox
            id="is_anonymous"
            checked={isAnonymous}
            onCheckedChange={(checked) =>
              onAnonymousChange?.(checked as boolean)
            }
          />
          <Label
            htmlFor="is_anonymous"
            className="text-sm font-normal cursor-pointer"
          >
            Post anonymously (Your name will be masked and LinkedIn profile
            hidden)
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}
