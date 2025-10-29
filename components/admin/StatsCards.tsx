import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  totalCount: number;
  statusFilter: "all" | "pending" | "approved" | "rejected";
  onFilterChange: (filter: "all" | "pending" | "approved" | "rejected") => void;
}

export function StatsCards({
  pendingCount,
  approvedCount,
  rejectedCount,
  totalCount,
  statusFilter,
  onFilterChange,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card
        className={`cursor-pointer transition-all ${
          statusFilter === "pending" ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() => onFilterChange("pending")}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
        </CardContent>
      </Card>
      <Card
        className={`cursor-pointer transition-all ${
          statusFilter === "approved" ? "ring-2 ring-green-500" : ""
        }`}
        onClick={() => onFilterChange("approved")}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Approved</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedCount}</div>
        </CardContent>
      </Card>
      <Card
        className={`cursor-pointer transition-all ${
          statusFilter === "rejected" ? "ring-2 ring-red-500" : ""
        }`}
        onClick={() => onFilterChange("rejected")}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Rejected</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedCount}</div>
        </CardContent>
      </Card>
      <Card
        className={`cursor-pointer transition-all ${
          statusFilter === "all" ? "ring-2 ring-purple-500" : ""
        }`}
        onClick={() => onFilterChange("all")}
      >
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCount}</div>
        </CardContent>
      </Card>
    </div>
  );
}
