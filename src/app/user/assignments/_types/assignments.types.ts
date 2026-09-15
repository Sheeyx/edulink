import type { Assignment } from "@/libs/types/assignments/assignment";
import type { Submission } from "@/libs/types/submissions/submission";

export type AssignmentWithContext = {
  assignment: Assignment;
  courseId: string;
  courseTitle: string;
  submission: Submission | null;
};
