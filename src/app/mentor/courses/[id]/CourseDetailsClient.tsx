// app/mentor/courses/[id]/CourseDetailsClient.tsx
"use client";

import * as React from "react";

import SectionsBlock from "../components/Sections/SectionsBlock";
import EditSectionModal from "../components/Sections/EditSectionModal";
import CreateSectionModal from "../components/Sections/CreateSections";
import DeleteSectionModal from "../components/Sections/components/DeleteSectionModal";

import PageShell from "../components/PageShell";
import CourseHeaderCard from "../components/CourseHeaderCard";

import { useCourseDetails } from "@/hooks/useCourseDetails";
import {
  SectionUI,
  LessonUI,
  UpdateLessonInput,
  UpdateLessonResponse,
  RemoveLessonResp,
} from "@/libs/types/course/types";

import CreateLessonModal from "../../lessons/CreateLessonModal";
import EditLessonModal from "../../lessons/EditLessonModal";
import DeleteLessonModal from "../../lessons/DeleteLessonModal";

import { gqlFetchAuth } from "@/libs/graphql";
import { REMOVE_LESSON, UPDATE_LESSON } from "@/graphql/mutation/lessons/lesson";

export default function CourseDetailsClient({ courseId }: { courseId: string }) {
  const { course, loading, error, removeSectionById, reload } =
    useCourseDetails(courseId);

  /* ───────── Section modals ───────── */

  const [addOpen, setAddOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState<{
    id: string;
    title: string;
    order: number;
  } | null>(null);

  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [sectionToDelete, setSectionToDelete] = React.useState<{
    id: string;
    title: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);
  const [deleteErr, setDeleteErr] = React.useState<string | null>(null);

  /* ───────── Lesson modals ───────── */

  const [createLessonOpen, setCreateLessonOpen] = React.useState(false);
  const [sectionForLesson, setSectionForLesson] = React.useState<string | null>(
    null
  );

  const [editLessonOpen, setEditLessonOpen] = React.useState(false);
  const [editingLesson, setEditingLesson] = React.useState<{
    sectionId: string;
    lessonId: string;
  } | null>(null);

  const [deleteLessonOpen, setDeleteLessonOpen] = React.useState(false);
  const [deletingLesson, setDeletingLesson] = React.useState<{
    sectionId: string;
    lessonId: string;
  } | null>(null);
  const [deleteLessonLoading, setDeleteLessonLoading] = React.useState(false);
  const [deleteLessonErr, setDeleteLessonErr] = React.useState<string | null>(
    null
  );

  /* ───────── Navigation ───────── */

  const handleBackClick = React.useCallback(() => {
    window.history.back();
  }, []);

  /* ───────── Section handlers ───────── */

  const handleAddSectionClick = React.useCallback(() => {
    setAddOpen(true);
  }, []);

  const handleAddLesson = React.useCallback((sectionId: string) => {
    setSectionForLesson(sectionId);
    setCreateLessonOpen(true);
  }, []);

  const handleEditSection = React.useCallback(
    (sectionId: string) => {
      if (!course) return;
      const sec = course.sections.find((s: SectionUI) => s.id === sectionId);
      if (!sec) return;

      setSelectedSection({
        id: sec.id,
        title: sec.title,
        order: sec.order,
      });
      setEditOpen(true);
    },
    [course]
  );

  const handleDeleteSectionRequest = React.useCallback(
    (sectionId: string) => {
      if (!course) return;
      const sec = course.sections.find((s: SectionUI) => s.id === sectionId);
      if (!sec) return;

      setSectionToDelete({ id: sec.id, title: sec.title });
      setDeleteErr(null);
      setDeleteOpen(true);
    },
    [course]
  );

  const handleDeleteCancel = React.useCallback(() => {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setSectionToDelete(null);
    setDeleteErr(null);
  }, [deleteLoading]);

  const handleDeleteConfirm = React.useCallback(async () => {
    if (!sectionToDelete) return;

    try {
      setDeleteLoading(true);
      setDeleteErr(null);
      await removeSectionById(sectionToDelete.id);
      setDeleteOpen(false);
      setSectionToDelete(null);
    } catch (err: any) {
      console.error(err);
      setDeleteErr(err?.message || "Failed to delete section.");
    } finally {
      setDeleteLoading(false);
    }
  }, [removeSectionById, sectionToDelete]);

  const handleSectionCreated = React.useCallback(async () => {
    await reload();
  }, [reload]);

  const handleSectionUpdated = React.useCallback(async () => {
    await reload();
  }, [reload]);

  const handleLessonCreated = React.useCallback(async () => {
    await reload();
    setCreateLessonOpen(false);
    setSectionForLesson(null);
  }, [reload]);

  /* ───────── Lesson handlers (edit / delete / reorder) ───────── */

  const handleEditLesson = React.useCallback(
    (sectionId: string, lessonId: string) => {
      setEditingLesson({ sectionId, lessonId });
      setEditLessonOpen(true);
    },
    []
  );

  const handleDeleteLesson = React.useCallback(
    (sectionId: string, lessonId: string) => {
      setDeletingLesson({ sectionId, lessonId });
      setDeleteLessonErr(null);
      setDeleteLessonOpen(true);
    },
    []
  );

  const handleReorderLessons = React.useCallback(
    (sectionId: string, lessons: LessonUI[]) => {
      console.log("Reorder lessons for section", sectionId, lessons);
      // TODO: call GraphQL mutation to persist order, then reload()
    },
    []
  );

  /* ───────── Locate current lesson objects ───────── */

  const lessonBeingEdited: LessonUI | null = React.useMemo(() => {
    if (!course || !editingLesson) return null;
    const sec = course.sections.find((s) => s.id === editingLesson.sectionId);
    if (!sec?.lessons) return null;
    return sec.lessons.find((l) => l.id === editingLesson.lessonId) || null;
  }, [course, editingLesson]);

  const lessonBeingDeleted: LessonUI | null = React.useMemo(() => {
    if (!course || !deletingLesson) return null;
    const sec = course.sections.find((s) => s.id === deletingLesson.sectionId);
    if (!sec?.lessons) return null;
    return sec.lessons.find((l) => l.id === deletingLesson.lessonId) || null;
  }, [course, deletingLesson]);

  /* ───────── GraphQL helpers for lessons ───────── */

  const updateLesson = React.useCallback(
    async (input: UpdateLessonInput) => {
      const resp = await gqlFetchAuth<UpdateLessonResponse>(UPDATE_LESSON, {
        input,
      });

      if (!resp.updateLesson?._id) {
        throw new Error("Failed to update lesson.");
      }

      await reload();
    },
    [reload]
  );

  const handleSaveLesson = React.useCallback(
    async (data: { title: string; contentType: string; duration: string }) => {
      if (!editingLesson) return;

      const durationNum = Number(data.duration);
      if (!Number.isFinite(durationNum) || durationNum <= 0) {
        throw new Error("Lesson duration must be a positive number.");
      }

      // find current lesson to keep its video URL (if any)
      const current: LessonUI | null = (() => {
        if (!course) return null;
        const sec = course.sections.find(
          (s) => s.id === editingLesson.sectionId
        );
        if (!sec?.lessons) return null;
        return (
          sec.lessons.find((l) => l.id === editingLesson.lessonId) || null
        );
      })();

      await updateLesson({
        _id: editingLesson.lessonId,
        lessonTitle: data.title,
        lessonContentType: data.contentType,
        lessonDuration: durationNum,
        lessonVideoUrl:
          current && (current as any).videoUrl
            ? (current as any).videoUrl
            : undefined,
      });

      setEditLessonOpen(false);
      setEditingLesson(null);
    },
    [editingLesson, course, updateLesson]
  );

  const handleConfirmDeleteLesson = React.useCallback(async () => {
    if (!deletingLesson) return;

    try {
      setDeleteLessonLoading(true);
      setDeleteLessonErr(null);

      await gqlFetchAuth<RemoveLessonResp>(REMOVE_LESSON, {
        input: deletingLesson.lessonId,
      });

      await reload();
      setDeleteLessonOpen(false);
      setDeletingLesson(null);
    } catch (err: any) {
      console.error(err);
      setDeleteLessonErr(
        err?.message || "Failed to delete lesson. Please try again."
      );
    } finally {
      setDeleteLessonLoading(false);
    }
  }, [deletingLesson, reload]);

  /* ───────── Loading & error states ───────── */

  if (loading) {
    return (
      <PageShell onBack={handleBackClick}>
        <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
            Loading course...
          </div>
        </main>
      </PageShell>
    );
  }

  if (error || !course) {
    return (
      <PageShell onBack={handleBackClick}>
        <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
            <p className="text-sm text-rose-600">
              {error || "Course not found."}
            </p>
          </div>
        </main>
      </PageShell>
    );
  }

  /* ───────── Main render ───────── */

  return (
    <PageShell onBack={handleBackClick}>
      <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
        <CourseHeaderCard
          course={course}
          onAddSection={handleAddSectionClick}
        />

        <SectionsBlock
          sections={course.sections}
          onAddLesson={handleAddLesson}
          onEditSection={handleEditSection}
          onDeleteSection={handleDeleteSectionRequest}
          onEditLesson={handleEditLesson}
          onDeleteLesson={handleDeleteLesson}
          onReorderLessons={handleReorderLessons}
        />
      </main>

      {/* Section create */}
      <CreateSectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        courseId={course.id}
        onCreated={handleSectionCreated}
      />

      {/* Section edit */}
      <EditSectionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        courseId={course.id}
        sectionId={selectedSection?.id || null}
        initialTitle={selectedSection?.title || ""}
        initialOrder={selectedSection?.order || 1}
        onUpdated={handleSectionUpdated}
      />

      {/* Section delete */}
      <DeleteSectionModal
        open={deleteOpen}
        title={sectionToDelete?.title || ""}
        loading={deleteLoading}
        error={deleteErr}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      {/* Lesson create */}
      <CreateLessonModal
        open={createLessonOpen && !!sectionForLesson}
        sectionId={sectionForLesson || ""}
        onClose={() => {
          setCreateLessonOpen(false);
          setSectionForLesson(null);
        }}
        onSuccess={handleLessonCreated}
      />

      {/* Lesson edit */}
      <EditLessonModal
        open={editLessonOpen && !!lessonBeingEdited}
        onClose={() => {
          setEditLessonOpen(false);
          setEditingLesson(null);
        }}
        onSave={handleSaveLesson}
        initialTitle={lessonBeingEdited?.title || ""}
        initialContentType={lessonBeingEdited?.contentType || "TEXT"}
        initialDuration={
          (lessonBeingEdited?.duration as string | number | undefined) ?? ""
        }
      />

      {/* Lesson delete */}
      <DeleteLessonModal
        open={deleteLessonOpen && !!lessonBeingDeleted}
        title={lessonBeingDeleted?.title || ""}
        loading={deleteLessonLoading}
        error={deleteLessonErr}
        onCancel={() => {
          setDeleteLessonOpen(false);
          setDeletingLesson(null);
          setDeleteLessonErr(null);
        }}
        onConfirm={handleConfirmDeleteLesson}
      />
    </PageShell>
  );
}
