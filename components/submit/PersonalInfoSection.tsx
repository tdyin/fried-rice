import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface PersonalInfoSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function PersonalInfoSection({ register, errors }: PersonalInfoSectionProps) {
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
      </CardContent>
    </Card>
  );
}
