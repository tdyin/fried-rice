'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import Link from 'next/link';
import { Database } from '@/lib/database.types';
import { CheckCircle, XCircle, Edit2, Trash2, Download, Eye } from 'lucide-react';

type InterviewExperience = Database['public']['Tables']['interview_experiences']['Row'];

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [submissions, setSubmissions] = useState<InterviewExperience[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<InterviewExperience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [selectedSubmission, setSelectedSubmission] = useState<InterviewExperience | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<InterviewExperience>>({});

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
      setIsAuthenticated(true);
      fetchSubmissions(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredSubmissions(submissions);
    } else {
      setFilteredSubmissions(submissions.filter((sub) => sub.status === statusFilter));
    }
  }, [statusFilter, submissions]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('admin_token', password);
    setAdminToken(password);
    setIsAuthenticated(true);
    fetchSubmissions(password);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken('');
    setIsAuthenticated(false);
    setSubmissions([]);
  };

  const fetchSubmissions = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/submissions?status=all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        toast.error('Invalid admin password');
        handleLogout();
        return;
      }

      const data = await response.json();
      setSubmissions(data.data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast.error('Failed to fetch submissions');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubmissionStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Submission ${status}!`);
      fetchSubmissions(adminToken);
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm('Are you sure you want to delete this submission?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/submissions?id=${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete');
      }

      toast.success('Submission deleted!');
      fetchSubmissions(adminToken);
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast.error('Failed to delete submission');
    }
  };

  const openEditDialog = (submission: InterviewExperience) => {
    setSelectedSubmission(submission);
    setEditForm(submission);
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (submission: InterviewExperience) => {
    setSelectedSubmission(submission);
    setIsViewDialogOpen(true);
  };

  const handleEdit = async () => {
    if (!selectedSubmission) return;

    try {
      const response = await fetch('/api/admin/submissions', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ id: selectedSubmission.id, ...editForm }),
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      toast.success('Submission updated!');
      setIsEditDialogOpen(false);
      fetchSubmissions(adminToken);
    } catch (error) {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    }
  };

  const exportToCSV = async () => {
    try {
      const response = await fetch('/api/admin/export', {
        headers: {
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `interview-experiences-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter your admin password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Admin Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">Back to Home</Link>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      {/* Header */}
      <header className="border-b bg-white dark:bg-black sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {" "}
              🧑‍🍳 Rice Cooker
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage interview experience submissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" asChild>
              <Link href="/">Public View</Link>
            </Button>
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats & Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card
            className={`cursor-pointer transition-all ${
              statusFilter === "pending" ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => setStatusFilter("pending")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.filter((s) => s.status === "pending").length}
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              statusFilter === "approved" ? "ring-2 ring-green-500" : ""
            }`}
            onClick={() => setStatusFilter("approved")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.filter((s) => s.status === "approved").length}
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              statusFilter === "rejected" ? "ring-2 ring-red-500" : ""
            }`}
            onClick={() => setStatusFilter("rejected")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {submissions.filter((s) => s.status === "rejected").length}
              </div>
            </CardContent>
          </Card>
          <Card
            className={`cursor-pointer transition-all ${
              statusFilter === "all" ? "ring-2 ring-purple-500" : ""
            }`}
            onClick={() => setStatusFilter("all")}
          >
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              Showing {filteredSubmissions.length}{" "}
              {statusFilter !== "all" ? statusFilter : ""} submission(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  Loading submissions...
                </p>
              </div>
            ) : filteredSubmissions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No submissions found.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Company</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubmissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell className="font-medium">
                          {submission.student_name}
                        </TableCell>
                        <TableCell>{submission.company}</TableCell>
                        <TableCell>{submission.position}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              submission.status === "approved"
                                ? "default"
                                : submission.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(submission.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewDialog(submission)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(submission)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            {submission.status === "pending" && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateSubmissionStatus(
                                      submission.id,
                                      "approved"
                                    )
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    updateSubmissionStatus(
                                      submission.id,
                                      "rejected"
                                    )
                                  }
                                >
                                  <XCircle className="h-4 w-4 text-red-600" />
                                </Button>
                              </>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteSubmission(submission.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View Submission</DialogTitle>
            <DialogDescription>
              Full details of the submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Student Name</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.student_name}
                  </p>
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <a
                    href={selectedSubmission.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline mt-1 block"
                  >
                    View Profile
                  </a>
                </div>
                <div>
                  <Label>Company</Label>
                  <p className="text-sm mt-1">{selectedSubmission.company}</p>
                </div>
                <div>
                  <Label>Position</Label>
                  <p className="text-sm mt-1">{selectedSubmission.position}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Applied Date</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.applied_date
                      ? new Date(
                          selectedSubmission.applied_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label>Interview Date</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.interviewed_date
                      ? new Date(
                          selectedSubmission.interviewed_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
                <div>
                  <Label>Result Date</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.result_date
                      ? new Date(
                          selectedSubmission.result_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div>
                  <Label>Phone Screens</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.phone_screens}
                  </p>
                </div>
                <div>
                  <Label>Technical</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.technical_interviews}
                  </p>
                </div>
                <div>
                  <Label>Behavioral</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.behavioral_interviews}
                  </p>
                </div>
                <div>
                  <Label>Other</Label>
                  <p className="text-sm mt-1">
                    {selectedSubmission.other_interviews}
                  </p>
                </div>
              </div>
              <div>
                <Label>Interview Questions</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  {selectedSubmission.interview_questions}
                </p>
              </div>
              <div>
                <Label>Advice & Tips</Label>
                <p className="text-sm mt-1 whitespace-pre-wrap bg-gray-50 dark:bg-gray-900 p-3 rounded">
                  {selectedSubmission.advice_tips}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Submission</DialogTitle>
            <DialogDescription>
              Make changes to the submission
            </DialogDescription>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit_student_name">Student Name</Label>
                  <Input
                    id="edit_student_name"
                    value={editForm.student_name || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, student_name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_linkedin_url">LinkedIn URL</Label>
                  <Input
                    id="edit_linkedin_url"
                    value={editForm.linkedin_url || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, linkedin_url: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_company">Company</Label>
                  <Input
                    id="edit_company"
                    value={editForm.company || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit_position">Position</Label>
                  <Input
                    id="edit_position"
                    value={editForm.position || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, position: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_questions">Interview Questions</Label>
                <Textarea
                  id="edit_questions"
                  value={editForm.interview_questions || ""}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      interview_questions: e.target.value,
                    })
                  }
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_advice">Advice & Tips</Label>
                <Textarea
                  id="edit_advice"
                  value={editForm.advice_tips || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, advice_tips: e.target.value })
                  }
                  className="min-h-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit_status">Status</Label>
                <select
                  id="edit_status"
                  value={editForm.status || "pending"}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      status: e.target.value as
                        | "pending"
                        | "approved"
                        | "rejected",
                    })
                  }
                  className="w-full h-10 px-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-950 text-sm"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
