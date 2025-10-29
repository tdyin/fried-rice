import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface AdviceTipsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function AdviceTipsSection({ register, errors }: AdviceTipsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Advice & Tips *</CardTitle>
        <CardDescription>
          What advice would you give to future applicants?
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          {...register("advice_tips")}
          placeholder="Example: Practice LeetCode medium problems, review system design basics, prepare STAR method examples, be ready to discuss projects in detail..."
          className="min-h-[150px]"
        />
        {errors.advice_tips && (
          <p className="text-sm text-red-600 mt-2">
            {errors.advice_tips.message?.toString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
