'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { SuccessView } from "@/components/submit/SuccessView";
import { PersonalInfoSection } from "@/components/submit/PersonalInfoSection";
import { CompanyPositionSection } from "@/components/submit/CompanyPositionSection";
import { TimelineSection } from "@/components/submit/TimelineSection";
import { InterviewDetailsSection } from "@/components/submit/InterviewDetailsSection";
import { InterviewQuestionsSection } from "@/components/submit/InterviewQuestionsSection";
import { AdviceTipsSection } from "@/components/submit/AdviceTipsSection";
import { ConsentSection } from "@/components/submit/ConsentSection";

const interviewDateSchema = z.object({
  label: z.string().min(1, "Label is required"),
  date: z.string().min(1, "Date is required"),
});

const submissionSchema = z.object({
  student_name: z.string().min(1, "Student name is required"),
  linkedin_url: z
    .string()
    .url("Must be a valid URL")
    .refine((url) => url.includes("linkedin.com"), "Must be a LinkedIn URL"),
  company: z.string().min(1, "Company name is required"),
  position: z.string().min(1, "Position is required"),
  interview_dates: z.array(interviewDateSchema),
  phone_screens: z.number().min(0),
  technical_interviews: z.number().min(0),
  behavioral_interviews: z.number().min(0),
  other_interviews: z.number().min(0),
  interview_questions: z
    .string()
    .min(10, "Please provide interview questions (minimum 10 characters)"),
  advice_tips: z
    .string()
    .min(10, "Please provide advice/tips (minimum 10 characters)"),
  is_anonymous: z.boolean(),
  consent_given: z
    .boolean()
    .refine((val) => val === true, "You must give consent to proceed"),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export default function SubmitExperience() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [interviewDates, setInterviewDates] = useState<
    Array<{ label: string; date: string }>
  >([]);
  const [newDateLabel, setNewDateLabel] = useState("");
  const [newDateValue, setNewDateValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      phone_screens: 0,
      technical_interviews: 0,
      behavioral_interviews: 0,
      other_interviews: 0,
      is_anonymous: false,
      consent_given: false,
      interview_dates: [],
    },
  });

  const consentGiven = watch("consent_given");

  const addInterviewDate = () => {
    if (newDateLabel.trim() && newDateValue) {
      const updatedDates = [
        ...interviewDates,
        { label: newDateLabel.trim(), date: newDateValue },
      ];
      setInterviewDates(updatedDates);
      setValue("interview_dates", updatedDates);
      setNewDateLabel("");
      setNewDateValue("");
    }
  };

  const removeInterviewDate = (index: number) => {
    const updatedDates = interviewDates.filter((_, i) => i !== index);
    setInterviewDates(updatedDates);
    setValue("interview_dates", updatedDates);
  };

  const moveInterviewDate = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === interviewDates.length - 1)
    ) {
      return;
    }

    const updatedDates = [...interviewDates];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [updatedDates[index], updatedDates[newIndex]] = [
      updatedDates[newIndex],
      updatedDates[index],
    ];
    setInterviewDates(updatedDates);
    setValue("interview_dates", updatedDates);
  };

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit");
      }

      toast.success("Success!", {
        description: result.message,
      });
      setShowSuccess(true);
      reset();
      setInterviewDates([]);
    } catch (error) {
      toast.error("Error", {
        description:
          error instanceof Error
            ? error.message
            : "Failed to submit your experience",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return <SuccessView onSubmitAnother={() => setShowSuccess(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Share Your Interview Experience
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Help future students by sharing your interview journey. All
            submissions are reviewed before being published.
          </p>
          <div className="mt-4">
            <Button variant="outline" asChild>
              <Link href="/">← Back to Search</Link>
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <PersonalInfoSection
            register={register}
            errors={errors}
            isAnonymous={watch("is_anonymous")}
            onAnonymousChange={(checked) => setValue("is_anonymous", checked)}
          />
          <CompanyPositionSection register={register} errors={errors} />
          <TimelineSection
            interviewDates={interviewDates}
            newDateLabel={newDateLabel}
            setNewDateLabel={setNewDateLabel}
            newDateValue={newDateValue}
            setNewDateValue={setNewDateValue}
            onAddDate={addInterviewDate}
            onRemoveDate={removeInterviewDate}
            onMoveDate={moveInterviewDate}
          />
          <InterviewDetailsSection register={register} />
          <InterviewQuestionsSection register={register} errors={errors} />
          <AdviceTipsSection register={register} errors={errors} />
          <ConsentSection
            consentGiven={consentGiven}
            onConsentChange={(checked) => setValue("consent_given", checked)}
            errors={errors}
          />

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              size="lg"
              className="w-full md:w-auto"
            >
              {isSubmitting ? "Submitting..." : "Submit Experience"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
