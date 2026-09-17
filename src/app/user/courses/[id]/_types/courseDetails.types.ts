export type LessonProgress = {
  _id: string;
  progressPercentage: number;
  isCompleted: boolean;
  lastWatchedTime: number;
  watchedTime: number;
  videoDuration: number;
};

export type Lesson = {
  _id: string;
  sectionId: string;
  lessonTitle: string;
  lessonStatus?: string | null;
  lessonContentType?: string | null;
  lessonDuration?: string | number | null;
  lessonUrl?: string | null;
  isLocked?: boolean | null;
  deletedAt?: string | null;
  lessonProgress?: LessonProgress | null;
};

export type Section = {
  _id: string;
  courseId: string;
  sectionStatus?: string | null;
  moduleTitle: string;
  moduleOrder?: number | null;
  totalLessons?: number | null;
  deletedAt?: string | null;
  lessons?: Lesson[] | null;
};

export type MemberData = {
  _id: string;
  memberFullName?: string | null;
  memberImage?: string | null;
  memberBio?: string | null;
};

export type EnrolledCourseDetails = {
  _id: string;
  courseTitle: string;
  courseDesc?: string | null;
  courseImage?: string | null;
  courseCategory?: string | null;
  languageType?: string | null;
  courseLevel?: string | null;
  coursePrice?: number | null;
  courseStatus?: string | null;

  mentorId?: string | null;
  courseEnrolledMembers?: number | null;
  maxStudents?: number | null;
  currentEnrolledMembers?: number | null;
  courseStartDate?: string | null;
  isFull?: boolean | null;

  courseTotalModules?: number | null;
  courseTotalLessons?: number | null;
  courseRating?: number | null;

  createdAt?: string | null;
  updatedAt?: string | null;

  sectionsWithLessons?: Section[] | null;
  memberData?: MemberData | null;
};

export type GetMyEnrolledCourseResp = {
  getMyEnrolledCourse: EnrolledCourseDetails | null;
};
