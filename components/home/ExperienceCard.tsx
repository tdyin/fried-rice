import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Calendar,
  User,
  ExternalLink,
} from "lucide-react";
import { Database } from "@/lib/database.types";

type InterviewExperience =
  Database["public"]["Tables"]["interview_experiences"]["Row"];

interface ExperienceCardProps {
  experience: InterviewExperience;
  keyword: string;
}

export function ExperienceCard({ experience, keyword }: ExperienceCardProps) {
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark
          key={index}
          className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  // Name is already masked on the server for anonymous posts
  const displayName = experience.student_name;
  const showLinkedIn =
    experience.linkedin_url && experience.linkedin_url !== "";

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              {highlightText(experience.position, keyword)}
            </CardTitle>
            <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Briefcase className="h-3 w-3" />
                {highlightText(experience.company, keyword)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {displayName}
              </Badge>
              {experience.created_at && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(experience.created_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
          {showLinkedIn && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={experience.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                LinkedIn <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timeline */}
        {experience.interview_dates &&
          experience.interview_dates.length > 0 && (
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
              {experience.interview_dates.map((dateEntry, idx) => (
                <span key={idx}>
                  {dateEntry.label}:{" "}
                  {new Date(dateEntry.date).toLocaleDateString()}
                </span>
              ))}
            </div>
          )}

        {/* Interview Count */}
        <div className="flex flex-wrap gap-2">
          {experience.phone_screens > 0 && (
            <Badge variant="outline">
              {experience.phone_screens} Phone Screen(s)
            </Badge>
          )}
          {experience.technical_interviews > 0 && (
            <Badge variant="outline">
              {experience.technical_interviews} Technical
            </Badge>
          )}
          {experience.behavioral_interviews > 0 && (
            <Badge variant="outline">
              {experience.behavioral_interviews} Behavioral
            </Badge>
          )}
          {experience.other_interviews > 0 && (
            <Badge variant="outline">{experience.other_interviews} Other</Badge>
          )}
        </div>

        {/* Interview Questions */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Interview Questions
          </h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {highlightText(experience.interview_questions, keyword)}
          </p>
        </div>

        {/* Advice & Tips */}
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Advice & Tips
          </h4>
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {highlightText(experience.advice_tips, keyword)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
