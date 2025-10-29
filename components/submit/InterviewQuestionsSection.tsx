import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UseFormRegister, FieldErrors } from "react-hook-form";

interface InterviewQuestionsSectionProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

export function InterviewQuestionsSection({ register, errors }: InterviewQuestionsSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview Questions *</CardTitle>
        <CardDescription>
          What questions were you asked? Be as detailed as possible to help others prepare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          {...register("interview_questions")}
          placeholder="Example: Technical round - Asked to implement a binary search tree, design a URL shortener. Behavioral - Tell me about a time you worked in a team..."
          className="min-h-[150px]"
        />
        {errors.interview_questions && (
          <p className="text-sm text-red-600 mt-2">
            {errors.interview_questions.message?.toString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
