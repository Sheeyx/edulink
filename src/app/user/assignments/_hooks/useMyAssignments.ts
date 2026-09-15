"use client";

import { useQuery } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_MY_ASSIGNMENTS } from "@/graphql/query/assignments/assignments";
import { GET_MY_SUBMISSIONS } from "@/graphql/query/submissions/submissions";
import type { GetMyAssignmentsResp } from "@/libs/types/assignments/assignment";
import type { GetMySubmissionsResp, Submission } from "@/libs/types/submissions/submission";
import type { EnrolledCourse } from "../../courses/_types/courses.types";
import type { AssignmentWithContext } from "../_types/assignments.types";

export function useMyAssignments(courses: EnrolledCourse[], enabled: boolean) {
  const courseIds = courses.map((c) => c._id);

  return useQuery({
    queryKey: ["user", "myAssignments", courseIds],
    queryFn: async (): Promise<AssignmentWithContext[]> => {
      const [assignmentsByCourse, submissionsRes] = await Promise.all([
        Promise.all(
          courses.map(async (course) => {
            const res = await gqlFetchAuth<GetMyAssignmentsResp>(GET_MY_ASSIGNMENTS, {
              courseId: course._id,
            });
            return { course, list: res.getMyAssignments?.list ?? [] };
          })
        ),
        gqlFetchAuth<GetMySubmissionsResp>(GET_MY_SUBMISSIONS, { input: null }),
      ]);

      const submissionByAssignmentId = new Map<string, Submission>();
      for (const s of submissionsRes.getMySubmissions?.list ?? []) {
        submissionByAssignmentId.set(s.assignmentId, s);
      }

      const merged: AssignmentWithContext[] = [];
      for (const { course, list } of assignmentsByCourse) {
        for (const assignment of list) {
          merged.push({
            assignment,
            courseId: course._id,
            courseTitle: course.courseTitle,
            submission: submissionByAssignmentId.get(assignment._id) ?? null,
          });
        }
      }

      merged.sort((a, b) => {
        const aDate = a.assignment.dueDate ? new Date(a.assignment.dueDate).getTime() : 0;
        const bDate = b.assignment.dueDate ? new Date(b.assignment.dueDate).getTime() : 0;
        return aDate - bDate;
      });

      return merged;
    },
    enabled: enabled && courses.length > 0,
  });
}
