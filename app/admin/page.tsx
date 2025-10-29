'use client';

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Database } from '@/lib/database.types';
import { LoginForm } from "@/components/admin/LoginForm";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { StatsCards } from "@/components/admin/StatsCards";
import { SubmissionsTable } from "@/components/admin/SubmissionsTable";
import { ViewDialog } from "@/components/admin/ViewDialog";
import { EditDialog } from "@/components/admin/EditDialog";

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
      <LoginForm
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-black">
      <AdminHeader onExport={exportToCSV} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <StatsCards
          pendingCount={
            submissions.filter((s) => s.status === "pending").length
          }
          approvedCount={
            submissions.filter((s) => s.status === "approved").length
          }
          rejectedCount={
            submissions.filter((s) => s.status === "rejected").length
          }
          totalCount={submissions.length}
          statusFilter={statusFilter}
          onFilterChange={setStatusFilter}
        />

        <SubmissionsTable
          submissions={filteredSubmissions}
          isLoading={isLoading}
          statusFilter={statusFilter}
          onView={openViewDialog}
          onEdit={openEditDialog}
          onApprove={(id) => updateSubmissionStatus(id, "approved")}
          onReject={(id) => updateSubmissionStatus(id, "rejected")}
          onDelete={deleteSubmission}
        />
      </main>

      <ViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        submission={selectedSubmission}
      />

      <EditDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        submission={selectedSubmission}
        editForm={editForm}
        onFormChange={setEditForm}
        onSave={handleEdit}
      />
    </div>
  );
}
