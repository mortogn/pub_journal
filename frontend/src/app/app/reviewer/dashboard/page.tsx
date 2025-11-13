"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/common/stat-card";
import { ReviewerStats } from "@/types";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  ThumbsUp,
  FileEdit,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

export default function ReviewerDashboardPage() {
  const [stats, setStats] = useState<ReviewerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getCookie("ac-token");
        const response = await api<ReviewerStats>("/stats/reviewer", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch reviewer stats:", error);
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
      <h1 className="text-3xl font-bold mb-6">Reviewer Dashboard</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Review Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Assignments"
              value={stats.totalAssignments}
              icon={ClipboardList}
            />
            <StatCard
              title="Completed Reviews"
              value={stats.completedReviews}
              icon={CheckCircle2}
            />
            <StatCard
              title="Pending Reviews"
              value={stats.pendingReviews}
              icon={Clock}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Recommendations Given</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Accept"
              value={stats.acceptRecommendations}
              icon={ThumbsUp}
            />
            <StatCard
              title="Minor Revision"
              value={stats.minorRevisionRecommendations}
              icon={FileEdit}
            />
            <StatCard
              title="Major Revision"
              value={stats.majorRevisionRecommendations}
              icon={AlertTriangle}
            />
            <StatCard
              title="Reject"
              value={stats.rejectRecommendations}
              icon={XCircle}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
