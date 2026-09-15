// src/libs/types/submissions/submission.ts

export type SubmissionStatus = "SUBMITTED" | "LATE" | "PASSED" | "FAILED";

export type SubmissionMember = {
  _id: string;
  memberFullName?: string | null;
  memberImage?: string | null;
};

export type Submission = {
  _id: string;
  assignmentId: string;
  studentId: string;
  answer: string;
  attachments?: string[] | null;
  submittedDate: string;
  status: SubmissionStatus;
  feedback?: string | null;
  gradedBy?: string | null;
  gradedDate?: string | null;
  createdAt: string;
  updatedAt: string;
  studentData?: SubmissionMember | null;
  graderData?: SubmissionMember | null;
};

export type SubmitAssignmentInput = {
  assignmentId: string;
  answer: string;
  attachments?: string[];
};

export type UpdateSubmissionInput = {
  _id: string;
  answer?: string;
  attachments?: string[];
};

export type GradeSubmissionInput = {
  submissionId: string;
  feedback: string;
  status: "PASSED" | "FAILED";
};

export type SubmitAssignmentResp = { submitAssignment: Submission };
export type UpdateSubmissionResp = { updateSubmission: Submission };
export type GradeSubmissionResp = { gradeSubmission: Submission };
export type RemoveSubmissionAttachmentResp = { removeSubmissionAttachment: Submission };

export type GetSubmissionsResp = {
  getSubmissions: {
    list: Submission[];
    metaCounter: { total: number }[];
  };
};

export type GetSubmissionByIdResp = { getSubmissionById: Submission };

export type GetMySubmissionsResp = {
  getMySubmissions: {
    list: Submission[];
    metaCounter: { total: number }[];
  };
};
