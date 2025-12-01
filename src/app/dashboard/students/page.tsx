// src/app/admin/students/page.tsx
"use client";

import { useState, useEffect } from "react";
import { FiSearch, FiFilter, FiMoreVertical } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-context";
import { useAdminStudents } from "@/hooks/admin/useAdminStudents";
import { gqlFetchAuth } from "@/libs/graphql";

// ---- Types from backend enums ----
type MemberRole = "STUDENT" | "MENTOR" | "ADMIN";
type MemberStatus = "ACTIVE" | "INACTIVE" | "BLOCKED" | "DELETE";

// ---- Mutation ----
const UPDATE_MEMBER_BY_ADMIN = `
  mutation UpdateMemberByAdmin($input: UpdateAdminInput!) {
    updateMemberByAdmin(input: $input) {
      _id
      memberRole
      memberStatus
    }
  }
`;

export default function StudentsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"ALL" | MemberStatus>("ALL");

  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data, isLoading, refetch } = useAdminStudents({
    page,
    limit,
    search,
    status: statusFilter === "ALL" ? undefined : statusFilter,
  });

  const list = data?.list ?? [];
  const total = data?.metaCounter?.total ?? 0;

  // 🔒 redirect non-admins
  useEffect(() => {
    if (!user) return;
    if (user.role !== "ADMIN") {
      router.replace("/");
    }
  }, [user, router]);

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  // ---- Update role/status ----
  async function updateMember(
    memberId: string,
    updates: { memberRole?: MemberRole; memberStatus?: MemberStatus }
  ) {
    try {
      setUpdatingId(memberId);
      setSuccessMsg(null);

      await gqlFetchAuth(UPDATE_MEMBER_BY_ADMIN, {
        input: {
          _id: memberId,
          ...updates,
        },
      });

      // re-load list from backend so UI reflects latest values
      await refetch();

      setSuccessMsg("Member updated successfully ✅");
      // hide message after 2 seconds
      setTimeout(() => setSuccessMsg(null), 2000);
    } catch (err: any) {
      console.error("[updateMemberByAdmin] error:", err);
      if (typeof window !== "undefined") {
        alert(err?.message || "Failed to update member.");
      }
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Success toast */}
      {successMsg && (
        <div className="fixed right-6 top-20 z-20 rounded-xl bg-emerald-100 border border-emerald-200 px-4 py-2 text-sm text-emerald-800 shadow-md">
          {successMsg}
        </div>
      )}

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">
            View and manage all students. Promote to mentor or change status.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FiSearch className="text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name or email"
              className="outline-none bg-transparent text-sm min-w-[220px]"
            />
          </div>

          {/* Filter by status */}
          <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <FiFilter className="text-gray-400" size={18} />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as "ALL" | MemberStatus);
                setPage(1);
              }}
              className="bg-transparent outline-none text-sm text-gray-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETE">Deleted</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 text-sm text-gray-600">
          Students ({total})
        </div>

        {isLoading ? (
          <div className="p-6 text-gray-500 text-center">Loading…</div>
        ) : list.length === 0 ? (
          <div className="p-6 text-gray-400 text-center">
            No students found.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-400">
              <tr>
                <th className="py-3 px-6 text-left">Name</th>
                <th className="py-3 px-6 text-left">Email</th>
                <th className="py-3 px-6 text-left">Phone</th>
                <th className="py-3 px-6 text-left">Role</th>
                <th className="py-3 px-6 text-left">Status</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s: any) => (
                <tr key={s._id} className="border-t border-gray-100">
                  <td className="py-4 px-6 font-medium text-gray-900">
                    {s.memberFullName}
                  </td>

                  <td className="py-4 px-6 text-gray-600">
                    {s.memberEmail || "-"}
                  </td>

                  <td className="py-4 px-6 text-gray-600">
                    {s.memberPhone || "-"}
                  </td>

                  {/* ROLE pill select */}
                  <td className="py-4 px-6">
                    <RoleSelect
                      value={s.memberRole as MemberRole}
                      disabled={updatingId === s._id}
                      onChange={(newRole) =>
                        updateMember(s._id, {
                          memberRole: newRole,
                          memberStatus: s.memberStatus as MemberStatus,
                        })
                      }
                    />
                  </td>

                  {/* STATUS pill select */}
                  <td className="py-4 px-6">
                    <StatusSelect
                      value={s.memberStatus as MemberStatus}
                      disabled={updatingId === s._id}
                      onChange={(newStatus) =>
                        updateMember(s._id, {
                          memberRole: s.memberRole as MemberRole,
                          memberStatus: newStatus,
                        })
                      }
                    />
                  </td>

                  <td className="py-4 px-6 text-right">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <FiMoreVertical size={18} className="text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 rounded-lg bg-gray-200 disabled:opacity-50"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 rounded-lg bg-gray-200"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

/* ---------- Styled Role dropdown ---------- */

function RoleSelect({
  value,
  disabled,
  onChange,
}: {
  value: MemberRole;
  disabled: boolean;
  onChange: (v: MemberRole) => void;
}) {
  const colorMap: Record<MemberRole, string> = {
    STUDENT: "bg-blue-100 text-blue-700 border-blue-200",
    MENTOR: "bg-purple-100 text-purple-700 border-purple-200",
    ADMIN: "bg-orange-100 text-orange-700 border-orange-300",
  };

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as MemberRole)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold
        border appearance-none cursor-pointer shadow-sm
        transition-all duration-150 hover:shadow-md
        ${colorMap[value]}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <option value="STUDENT">Student</option>
      <option value="MENTOR">Mentor</option>
      <option value="ADMIN">Admin</option>
    </select>
  );
}

/* ---------- Styled Status dropdown ---------- */

function StatusSelect({
  value,
  disabled,
  onChange,
}: {
  value: MemberStatus;
  disabled: boolean;
  onChange: (v: MemberStatus) => void;
}) {
  const colorMap: Record<MemberStatus, string> = {
    ACTIVE: "bg-green-100 text-green-700 border-green-300",
    INACTIVE: "bg-gray-200 text-gray-700 border-gray-300",
    BLOCKED: "bg-red-100 text-red-700 border-red-300",
    DELETE: "bg-red-200 text-red-800 border-red-400",
  };

  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as MemberStatus)}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold
        border appearance-none cursor-pointer shadow-sm
        transition-all duration-150 hover:shadow-md
        ${colorMap[value]}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
    >
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
      <option value="BLOCKED">Blocked</option>
      <option value="DELETE">Deleted</option>
    </select>
  );
}
