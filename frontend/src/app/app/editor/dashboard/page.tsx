"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/common/stat-card";
import { EditorStats } from "@/types";
import {
  ClipboardList,
  CheckCircle2,
  Clock,
  CheckCircle,
  XCircle,
  FileEdit,
} from "lucide-react";
import api from "@/lib/api";
import { getCookie } from "cookies-next";

export default function EditorDashboardPage() {
  const [stats, setStats] = useState<EditorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getCookie("ac-token");
        const response = await api<EditorStats>("/stats/editor", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch editor stats:", error);
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
      <h1 className="text-3xl font-bold mb-6">Editor Dashboard</h1>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Assignment Overview</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Total Assignments"
              value={stats.totalAssignments}
              icon={ClipboardList}
            />
            <StatCard
              title="Completed Decisions"
              value={stats.completedDecisions}
              icon={CheckCircle2}
            />
            <StatCard
              title="Pending Decisions"
              value={stats.pendingDecisions}
              icon={Clock}
            />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Decisions Made</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <StatCard
              title="Accepted"
              value={stats.acceptedDecisions}
              icon={CheckCircle}
            />
            <StatCard
              title="Rejected"
              value={stats.rejectedDecisions}
              icon={XCircle}
            />
            <StatCard
              title="Revision Required"
              value={stats.revisionRequiredDecisions}
              icon={FileEdit}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
