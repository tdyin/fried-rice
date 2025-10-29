import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Search } from "lucide-react";

interface SearchFilterProps {
  keyword: string;
  setKeyword: (keyword: string) => void;
  companyFilter: string;
  setCompanyFilter: (company: string) => void;
  uniqueCompanies: string[];
  filteredCount: number;
  totalCount: number;
}

export function SearchFilter({
  keyword,
  setKeyword,
  companyFilter,
  setCompanyFilter,
  uniqueCompanies,
  filteredCount,
  totalCount,
}: SearchFilterProps) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Search Experiences</CardTitle>
        <CardDescription>
          Find interview experiences by company, position, questions, or tips
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
              Found {filteredCount} of {totalCount} experiences
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
  );
}
