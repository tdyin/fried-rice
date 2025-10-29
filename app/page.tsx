"use client";

import { useState, useEffect } from "react";
import { Database } from "@/lib/database.types";
import { Header } from "@/components/home/Header";
import { SearchFilter } from "@/components/home/SearchFilter";
import { ExperienceCard } from "@/components/home/ExperienceCard";
import { Footer } from "@/components/home/Footer";
import { BackToTop } from "@/components/home/BackToTop";
import { LoadingState } from "@/components/home/LoadingState";
import { EmptyState } from "@/components/home/EmptyState";

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
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  const uniqueCompanies = Array.from(
    new Set(experiences.map((exp) => exp.company))
  ).sort();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-black">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilter
          keyword={keyword}
          setKeyword={setKeyword}
          companyFilter={companyFilter}
          setCompanyFilter={setCompanyFilter}
          uniqueCompanies={uniqueCompanies}
          filteredCount={filteredExperiences.length}
          totalCount={experiences.length}
        />

        {isLoading ? (
          <LoadingState />
        ) : filteredExperiences.length === 0 ? (
          <EmptyState hasExperiences={experiences.length > 0} />
        ) : (
          <div className="space-y-6">
            {filteredExperiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
                keyword={keyword}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
      <BackToTop show={showBackToTop} />
    </div>
  );
}
