'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import Link from 'next/link';

const submissionSchema = z.object({
  student_name: z.string().min(1, 'Student name is required'),
  linkedin_url: z.string().url('Must be a valid URL').refine(
    (url) => url.includes('linkedin.com'),
    'Must be a LinkedIn URL'
  ),
  company: z.string().min(1, 'Company name is required'),
  position: z.string().min(1, 'Position is required'),
  applied_date: z.string().optional(),
  interviewed_date: z.string().optional(),
  result_date: z.string().optional(),
  phone_screens: z.number().min(0),
  technical_interviews: z.number().min(0),
  behavioral_interviews: z.number().min(0),
  other_interviews: z.number().min(0),
  interview_questions: z.string().min(10, 'Please provide interview questions (minimum 10 characters)'),
  advice_tips: z.string().min(10, 'Please provide advice/tips (minimum 10 characters)'),
  consent_given: z.boolean().refine((val) => val === true, 'You must give consent to proceed'),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

export default function SubmitExperience() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
      consent_given: false,
    },
  });

  const consentGiven = watch('consent_given');

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          applied_date: data.applied_date || null,
          interviewed_date: data.interviewed_date || null,
          result_date: data.result_date || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      toast.success('Success!', {
        description: result.message,
      });
      setShowSuccess(true);
      reset();
    } catch (error) {
      toast.error('Error', {
        description: error instanceof Error ? error.message : 'Failed to submit your experience',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 dark:border-green-900">
            <CardHeader>
              <CardTitle className="text-green-600 dark:text-green-400">Submission Received!</CardTitle>
              <CardDescription>
                Thank you for sharing your interview experience. Your submission will be reviewed and published soon.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your entry is now pending review. Once approved, it will be visible to other students searching for interview insights.
              </p>
              <div className="flex gap-3">
                <Button onClick={() => setShowSuccess(false)}>
                  Submit Another Experience
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/">View Experiences</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
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
          {/* Personal Information */}
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
                    {errors.student_name.message}
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
                    {errors.linkedin_url.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Company & Position */}
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
                    {errors.company.message}
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
                    {errors.position.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>
                When did each stage happen? (Optional)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="applied_date">Applied Date</Label>
                  <Input
                    id="applied_date"
                    type="date"
                    {...register("applied_date")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interviewed_date">Interview Date</Label>
                  <Input
                    id="interviewed_date"
                    type="date"
                    {...register("interviewed_date")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="result_date">Result Date</Label>
                  <Input
                    id="result_date"
                    type="date"
                    {...register("result_date")}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interview Details */}
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
                  <Label htmlFor="technical_interviews">
                    Technical Interviews
                  </Label>
                  <Input
                    id="technical_interviews"
                    type="number"
                    min="0"
                    {...register("technical_interviews", {
                      valueAsNumber: true,
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="behavioral_interviews">
                    Behavioral Interviews
                  </Label>
                  <Input
                    id="behavioral_interviews"
                    type="number"
                    min="0"
                    {...register("behavioral_interviews", {
                      valueAsNumber: true,
                    })}
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

          {/* Interview Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Interview Questions *</CardTitle>
              <CardDescription>
                What questions were you asked? Be as detailed as possible to
                help others prepare.
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
                  {errors.interview_questions.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Advice & Tips */}
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
                  {errors.advice_tips.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Consent */}
          <Card className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader>
              <CardTitle className="text-yellow-800 dark:text-yellow-200">
                Consent Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="consent_given"
                  checked={consentGiven}
                  onCheckedChange={(checked) =>
                    setValue("consent_given", checked as boolean)
                  }
                />
                <div className="space-y-1">
                  <Label
                    htmlFor="consent_given"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    I consent to having my name and LinkedIn profile visible to
                    future students *
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your submission will help other students prepare for their
                    interviews. Your contact information will be shared to
                    enable networking.
                  </p>
                </div>
              </div>
              {errors.consent_given && (
                <p className="text-sm text-red-600 mt-2">
                  {errors.consent_given.message}
                </p>
              )}
            </CardContent>
          </Card>

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
