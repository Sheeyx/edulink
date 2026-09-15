export type Lesson = {
  _id: string;
  lessonTitle: string;
  lessonStatus?: string | null;
  lessonContentType?: string | null;
  lessonDuration?: string | number | null;
  lessonUrl?: string | null;
};

export type Section = {
  _id: string;
  moduleTitle: string;
  moduleOrder?: number | null;
  sectionStatus?: string | null;
  totalLessons?: number | null;
  lessons?: Lesson[] | null;
};

export type MentorMember = {
  _id: string;
  memberFullName?: string | null;
  memberImage?: string | null;
  memberBio?: string | null;
};

export type EnrolledCourse = {
  _id: string;
  courseTitle: string;
  courseDesc?: string | null;
  courseImage?: string | null;
  courseCategory?: string | null;
  languageType?: string | null;
  courseLevel?: string | null;
  coursePrice?: number | null;
  courseStatus?: string | null;

  courseEnrolledMembers?: number | null;
  maxStudents?: number | null;
  currentEnrolledMembers?: number | null;
  isFull?: boolean | null;

  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;

  sectionsWithLessons?: Section[] | null;
  memberData?: MentorMember | null;

  updatedAt?: string | null;
};

export type GetMyEnrolledCoursesResp = {
  getMyEnrolledCourses: EnrolledCourse[];
};
