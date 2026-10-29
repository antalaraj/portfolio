"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Eye,
  FolderGit2,
  Mail,
  Layers,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  FileDown,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Activity,
  Compass,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { adminApi } from "@/services/adminApi";
import { AnalyticsOverview } from "@/types";

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await adminApi.getAnalyticsOverview();
      setData(res.data);
    } catch (err: any) {
      setError(err?.message || "Failed to load real-time analytics from backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const metrics = data?.metrics;
  const viewsGrowth = metrics?.views_growth_pct ?? 0;
  const visitorsGrowth = metrics?.visitors_growth_pct ?? 0;

  const stats = [
    {
      label: "Total Page Views",
      value: (metrics?.total_views ?? 0).toLocaleString(),
      sub: (metrics?.total_views ?? 0) > 0 ? `${metrics?.today_views ?? 0} logged today` : "No visits recorded yet",
      growth: (metrics?.total_views ?? 0) > 0 ? viewsGrowth : undefined,
      icon: Eye,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Unique Visitors",
      value: (metrics?.unique_visitors ?? 0).toLocaleString(),
      sub: (metrics?.unique_visitors ?? 0) > 0 ? `${metrics?.monthly_views ?? 0} in last 30d` : "Awaiting first visitor",
      growth: (metrics?.unique_visitors ?? 0) > 0 ? visitorsGrowth : undefined,
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Resume Downloads",
      value: (metrics?.resume_downloads ?? 0).toLocaleString(),
      sub: (metrics?.resume_downloads ?? 0) > 0 ? "High-intent recruiter downloads" : "0 downloads logged",
      icon: FileDown,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Client Inquiries",
      value: (metrics?.unread_messages ?? 0).toLocaleString(),
      sub: `${metrics?.total_messages ?? 0} total submissions`,
      icon: Mail,
      color: metrics?.unread_messages ? "text-amber-600" : "text-slate-600",
      bg: metrics?.unread_messages ? "bg-amber-50" : "bg-slate-100",
      alert: (metrics?.unread_messages ?? 0) > 0,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900 tracking-tight">
              Portfolio Overview & Analytics
            </h2>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Real Data
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real visitor telemetry, page impression trends, conversion tracking, and content status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={fetchOverview}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh Metrics
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-gray-300 text-slate-700 bg-white hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
            Live Site
          </a>
          <Link
            href="/admin/builder"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-2xs"
          >
            <Layers className="w-3.5 h-3.5" />
            Website Builder
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            onClick={fetchOverview}
            className="font-bold underline hover:opacity-80"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Primary KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex items-start justify-between relative overflow-hidden transition-all hover:border-gray-300"
            >
              <div>
                <div className="text-xs font-medium text-slate-500">{stat.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1 tracking-tight">
                  {stat.value}
                </div>

                {stat.growth !== undefined && (
                  <div
                    className={`text-[11px] font-semibold flex items-center gap-1 mt-1 ${
                      stat.growth >= 0 ? "text-emerald-600" : "text-rose-600"
                    }`}
                  >
                    {stat.growth >= 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {stat.growth >= 0 ? `+${stat.growth}%` : `${stat.growth}%`} vs prev week
                    </span>
                  </div>
                )}

                {stat.sub && (
                  <div className="text-[11px] text-slate-400 mt-1">{stat.sub}</div>
                )}
              </div>

              <div
                className={`w-11 h-11 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center shrink-0 shadow-2xs`}
              >
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts & Popular Paths */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main 7-Day Traffic Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-blue-600" />
                Live Visitor & Page View Trends (Last 7 Days)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Aggregated daily visits and unique visitors logged by privacy-preserving telemetry
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-600">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                Page Views
              </span>
              <span className="flex items-center gap-1.5 text-indigo-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Unique Visitors
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data?.traffic_history || []}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="visitorsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderColor: "#E2E8F0",
                    borderRadius: "8px",
                    fontSize: "12px",
                    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.07)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  name="Page Views"
                  stroke="#2563EB"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#viewsGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="visitors"
                  name="Unique Visitors"
                  stroke="#6366F1"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#visitorsGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Most Viewed Paths & Distribution */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-blue-600" />
                Most Viewed Sections
              </h3>
              <span className="text-[11px] font-semibold text-slate-400">Visits & Share</span>
            </div>

            <div className="space-y-3 pt-1">
              {(data?.popular_paths || []).slice(0, 6).map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-700 font-medium truncate max-w-[180px]">
                      {p.path === "/" ? "/ (Homepage Hero)" : p.path}
                    </span>
                    <span className="font-semibold text-gray-900 text-[11px]">
                      {p.visits} <span className="text-slate-400 font-normal">({p.percentage || 0}%)</span>
                    </span>
                  </div>
                  {/* Visual Progress Bar */}
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(5, p.percentage || 0))}%` }}
                    ></div>
                  </div>
                </div>
              ))}

              {(!data?.popular_paths || data.popular_paths.length === 0) && (
                <div className="text-center py-8 text-xs text-slate-400">
                  No path visits recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Portfolio Sections</span>
            <Link
              href="/admin/builder"
              className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
            >
              Reorder in Builder <ArrowUpRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Traffic Sources, Device Breakdown & Recent Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Traffic Referrers */}
        <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <h3 className="text-sm font-bold text-gray-900 mb-1 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-blue-600" />
            Top Traffic Channels
          </h3>
          <p className="text-[11px] text-slate-400 mb-4">
            Where visitors discovered your portfolio
          </p>

          <div className="space-y-2.5">
            {(data?.top_referrers || []).map((ref, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-2.5 rounded-lg border border-gray-100 bg-slate-50/60 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <span className="font-semibold text-gray-800">{ref.name}</span>
                </div>
                <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200 text-[11px]">
                  {ref.count} views
                </span>
              </div>
            ))}

            {(!data?.top_referrers || data.top_referrers.length === 0) && (
              <div className="text-center py-6 text-xs text-slate-400">
                No external traffic channels recorded yet. Sources (GitHub, LinkedIn, Search) will populate here.
              </div>
            )}
          </div>


          {/* Device Type Breakdown */}
          <div className="mt-6 pt-5 border-t border-gray-100">
            <h4 className="text-xs font-bold text-gray-800 mb-2.5">Device Distribution</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(data?.device_breakdown || []).map((dev, idx) => {
                const Icon =
                  dev.device === "Mobile"
                    ? Smartphone
                    : dev.device === "Tablet"
                    ? Tablet
                    : Monitor;
                return (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-gray-200 bg-white shadow-2xs"
                  >
                    <Icon className="w-4 h-4 mx-auto text-slate-600 mb-1" />
                    <div className="text-[11px] font-semibold text-gray-800">{dev.device}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{dev.count} visits</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-Time Live Activity Stream */}
        <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Live Visitor Activity Stream
              </h3>
              <p className="text-[11px] text-slate-400">
                Chronological real-time visitor actions and page hits
              </p>
            </div>
            <span className="text-[11px] font-mono font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
              Streaming
            </span>
          </div>

          <div className="divide-y divide-gray-100 overflow-hidden">
            {(data?.recent_activity || []).map((ev) => (
              <div
                key={ev.id}
                className="py-2.5 flex items-center justify-between gap-4 text-xs hover:bg-slate-50/50 px-2 rounded-md transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                      ev.event_type === "resume_download"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-blue-50 text-blue-600"
                    }`}
                  >
                    {ev.event_type === "resume_download" ? (
                      <FileDown className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 flex items-center gap-2">
                      <span className="font-mono text-slate-700">{ev.path}</span>
                      {ev.event_type === "resume_download" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                          Resume Download
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>Source: {ev.referrer}</span>
                      <span>•</span>
                      <span>{ev.device}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[11px] font-medium text-slate-600">{ev.time_ago}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{ev.timestamp.split(" ")[1]}</div>
                </div>
              </div>
            ))}

            {(!data?.recent_activity || data.recent_activity.length === 0) && (
              <div className="text-center py-10 text-xs text-slate-400">
                No recent activity recorded.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Quick Status Bar */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-slate-400">Projects: </span>
            <span className="font-bold text-gray-900">
              {metrics?.published_projects || 0} / {metrics?.total_projects || 0} Published
            </span>
          </div>
          <div className="h-3 w-px bg-gray-200"></div>
          <div>
            <span className="text-slate-400">Technical Skills: </span>
            <span className="font-bold text-gray-900">{metrics?.total_skills || 0} Active</span>
          </div>
          <div className="h-3 w-px bg-gray-200"></div>
          <div>
            <span className="text-slate-400">Builder Sections: </span>
            <span className="font-bold text-gray-900">{metrics?.published_pages || 1} Homepage Active</span>
          </div>
          <div className="h-3 w-px bg-gray-200"></div>
          <div>
            <span className="text-slate-400">Inquiries: </span>
            <span className="font-bold text-gray-900">
              {metrics?.unread_messages || 0} Unread
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/projects"
            className="px-3 py-1 text-xs font-semibold rounded-md border border-gray-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Manage Projects
          </Link>
          <Link
            href="/admin/contact"
            className="px-3 py-1 text-xs font-semibold rounded-md border border-gray-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Open Inbox
          </Link>
        </div>
      </div>
    </div>
  );
}
