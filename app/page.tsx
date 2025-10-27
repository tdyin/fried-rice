"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, Calendar, User, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Database } from "@/lib/database.types";

type InterviewExperience =
  Database["public"]["Tables"]["interview_experiences"]["Row"];

export default function Home() {
  const [experiences, setExperiences] = useState<InterviewExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<
    InterviewExperience[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    filterExperiences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword, companyFilter, experiences]);

  const fetchExperiences = async () => {
    try {
      const response = await fetch("/api/experiences");
      const data = await response.json();
      setExperiences(data.data || []);
      setFilteredExperiences(data.data || []);
    } catch (error) {
      console.error("Error fetching experiences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterExperiences = () => {
    let filtered = experiences;

    if (companyFilter) {
      filtered = filtered.filter((exp) =>
        exp.company.toLowerCase().includes(companyFilter.toLowerCase())
      );
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filtered = filtered.filter(
        (exp) =>
          exp.interview_questions.toLowerCase().includes(lowerKeyword) ||
          exp.advice_tips.toLowerCase().includes(lowerKeyword) ||
          exp.position.toLowerCase().includes(lowerKeyword) ||
          exp.company.toLowerCase().includes(lowerKeyword)
      );
    }

    setFilteredExperiences(filtered);
  };

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

  const uniqueCompanies = Array.from(
    new Set(experiences.map((exp) => exp.company))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-black/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              🍘 Fried Rice
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Student-shared interview insights
            </p>
          </div>
          <Button asChild>
            <Link href="/submit">Share Your Experience</Link>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search & Filter Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Experiences</CardTitle>
            <CardDescription>
              Find interview experiences by company, position, questions, or
              tips
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by keyword (e.g., 'binary tree', 'system design')..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="w-full md:w-64">
                <select
                  value={companyFilter}
                  onChange={(e) => setCompanyFilter(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
                >
                  <option value="">All Companies</option>
                  {uniqueCompanies.map((company) => (
                    <option key={company} value={company}>
                      {company}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {(keyword || companyFilter) && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Found {filteredExperiences.length} of {experiences.length}{" "}
                  experiences
                </span>
                {(keyword || companyFilter) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setKeyword("");
                      setCompanyFilter("");
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Loading experiences...
            </p>
          </div>
        ) : filteredExperiences.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {experiences.length === 0
                  ? "No experiences have been published yet."
                  : "No experiences match your search criteria."}
              </p>
              <Button asChild variant="outline">
                <Link href="/submit">Be the first to share!</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {filteredExperiences.map((experience) => (
              <Card
                key={experience.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">
                        {highlightText(experience.position, keyword)}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 items-center text-sm text-gray-600 dark:text-gray-400">
                        <Badge
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          <Briefcase className="h-3 w-3" />
                          {highlightText(experience.company, keyword)}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <User className="h-3 w-3" />
                          {experience.student_name}
                        </Badge>
                        {experience.created_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(
                              experience.created_at
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
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
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Timeline */}
                  {(experience.applied_date ||
                    experience.interviewed_date ||
                    experience.result_date) && (
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                      {experience.applied_date && (
                        <span>
                          Applied:{" "}
                          {new Date(
                            experience.applied_date
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {experience.interviewed_date && (
                        <span>
                          Interviewed:{" "}
                          {new Date(
                            experience.interviewed_date
                          ).toLocaleDateString()}
                        </span>
                      )}
                      {experience.result_date && (
                        <span>
                          Result:{" "}
                          {new Date(
                            experience.result_date
                          ).toLocaleDateString()}
                        </span>
                      )}
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
                      <Badge variant="outline">
                        {experience.other_interviews} Other
                      </Badge>
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
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-16 py-8 bg-white dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Build with ❤️ by the ENGI 501 team @ Rice University: </p>
          <p>Alex S, Sean T, Sugi W, Tony Y</p>
          <p>
            <a
              href="https://github.com/tdyin/fried-rice"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
