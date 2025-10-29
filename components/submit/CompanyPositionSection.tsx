import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface CompanyPositionSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function CompanyPositionSection({ register, errors }: CompanyPositionSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Company & Position</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="company">Company *</Label>
          <Input
            id="company"
            {...register("company")}
            placeholder="e.g., Google, Amazon, Microsoft"
          />
          {errors.company && (
            <p className="text-sm text-red-600">
              {errors.company.message?.toString()}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            {...register("position")}
            placeholder="e.g., Software Engineering Internship"
          />
          {errors.position && (
            <p className="text-sm text-red-600">
              {errors.position.message?.toString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
