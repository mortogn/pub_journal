"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/common/stat-card";
import { AdminStats } from "@/types";
import {
  FileText,
  Send,
  Eye,
  CheckCircle,
  XCircle,
  Globe,
  FileEdit,
  Users,
  UserCheck,
  UserCog,
  PenTool,
} from "lucide-react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getCookie("ac-token");
        const response = await api<AdminStats>("/stats/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!stats) {
    return <div className="p-6">Failed to load statistics</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Submission Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Submissions"
              value={stats.totalSubmissions}
              icon={FileText}
            />
            <StatCard
              title="Submitted"
              value={stats.submittedCount}
              icon={Send}
            />
            <StatCard
              title="Under Review"
              value={stats.underReviewCount}
              icon={Eye}
            />
            <StatCard
              title="Accepted"
              value={stats.acceptedCount}
              icon={CheckCircle}
            />
            <StatCard
              title="Rejected"
              value={stats.rejectedCount}
              icon={XCircle}
            />
            <StatCard
              title="Published"
              value={stats.publishedCount}
              icon={Globe}
            />
            <StatCard
              title="Revision Required"
              value={stats.revisionRequiredCount}
              icon={FileEdit}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">User Statistics</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={Users}
            />
            <StatCard
              title="Authors"
              value={stats.totalAuthors}
              icon={PenTool}
            />
            <StatCard
              title="Reviewers"
              value={stats.totalReviewers}
              icon={UserCheck}
            />
            <StatCard
              title="Editors"
              value={stats.totalEditors}
              icon={UserCog}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
