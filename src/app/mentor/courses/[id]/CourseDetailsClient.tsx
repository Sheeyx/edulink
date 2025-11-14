// app/mentor/courses/[id]/CourseDetailsClient.tsx
"use client";

import * as React from "react";
import SectionsBlock from "../components/Sections/SectionsBlock";
import EditSectionModal from "../components/Sections/EditSectionModal";
import CreateSectionModal from "../components/Sections/CreateSections";
import { useCourseDetails } from "@/hooks/useCourseDetails";
import PageShell from "../components/PageShell";
import CourseHeaderCard from "../components/CourseHeaderCard";
import DeleteSectionModal from "../components/Sections/components/DeleteSectionModal";
import CreateLessonModal from "../../create-courses/CreateCourseForm";

export default function CourseDetailsClient({ courseId }: { courseId: string }) {
  const { course, loading, error, removeSectionById, reload } =
    useCourseDetails(courseId);

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

  // 👇 NEW: lesson modal state
  const [createLessonOpen, setCreateLessonOpen] = React.useState(false);
  const [sectionForLesson, setSectionForLesson] = React.useState<string | null>(
    null
  );

  const handleBackClick = React.useCallback(() => {
    window.history.back();
  }, []);

  const handleAddSectionClick = React.useCallback(() => {
    setAddOpen(true);
  }, []);

  // 👇 open lesson modal for selected section
  const handleAddLesson = React.useCallback((sectionId: string) => {
    setSectionForLesson(sectionId);
    setCreateLessonOpen(true);
  }, []);

  const handleEditSection = React.useCallback(
    (sectionId: string) => {
      if (!course) return;
      const sec = course.sections.find((s) => s.id === sectionId);
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
      const sec = course.sections.find((s) => s.id === sectionId);
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

  // 👇 when lesson created → reload and close modal
  const handleLessonCreated = React.useCallback(async () => {
    await reload();
    setCreateLessonOpen(false);
    setSectionForLesson(null);
  }, [reload]);

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

  return (
    <PageShell onBack={handleBackClick}>
      <main className="mx-auto mt-6 max-w-6xl px-4 pb-10 lg:px-0">
        <CourseHeaderCard course={course} onAddSection={handleAddSectionClick} />

        <SectionsBlock
          sections={course.sections}
          onAddLesson={handleAddLesson}
          onEditSection={handleEditSection}
          onDeleteSection={handleDeleteSectionRequest}
        />
      </main>

      <CreateSectionModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        courseId={course.id}
        onCreated={handleSectionCreated}
      />

      <EditSectionModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        courseId={course.id}
        sectionId={selectedSection?.id || null}
        initialTitle={selectedSection?.title || ""}
        initialOrder={selectedSection?.order || 1}
        onUpdated={handleSectionUpdated}
      />

      <DeleteSectionModal
        open={deleteOpen}
        title={sectionToDelete?.title || ""}
        loading={deleteLoading}
        error={deleteErr}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />

      <CreateLessonModal
        open={createLessonOpen && !!sectionForLesson}
        sectionId={sectionForLesson || ""}
        onClose={() => {
          setCreateLessonOpen(false);
          setSectionForLesson(null);
        }}
        onSuccess={handleLessonCreated}
      />
    </PageShell>
  );
}
