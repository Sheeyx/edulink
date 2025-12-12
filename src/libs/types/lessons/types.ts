// src/app/mentor/lessons/edit/types.ts

export type EditLessonFormValues = {
  title: string;
  contentType: string;
  duration: string;

  // NEW:
  removeVideo?: boolean; // user "remove old" qilsa
  newVideoFile?: File | null; // user yangi video tanlasa
};

export type EditLessonModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (data: EditLessonFormValues) => Promise<void> | void;

  initialTitle: string;
  initialContentType?: string;
  initialDuration?: string | number | null;

  /** full URL (preview/link uchun) */
  initialVideoUrl?: string;
};
