// app/mentor/courses/[id]/CourseDetailsClient.tsx
"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";

import SectionsBlock from "../_components/Sections/SectionsBlock";
import EditSectionModal from "../_components/Sections/EditSectionModal";
import CreateSectionModal from "../_components/Sections/CreateSections";
import DeleteSectionModal from "../_components/Sections/_components/DeleteSectionModal";

import PageShell from "../_components/PageShell";
import CourseHeaderCard from "../_components/CourseHeaderCard";
import CourseDetailTabs, {
  type CourseDetailTab,
} from "../_components/CourseDetailTabs";

import ResourcesBlock from "../_components/Resources/ResourcesBlock";
import CreateResourceModal from "../_components/Resources/CreateResourceModal";
import EditResourceModal from "../_components/Resources/EditResourceModal";
import DeleteResourceModal from "../_components/Resources/DeleteResourceModal";

import ScheduleBlock from "../_components/Schedule/ScheduleBlock";
import CreateScheduleModal from "../_components/Schedule/CreateScheduleModal";
import EditScheduleModal from "../_components/Schedule/EditScheduleModal";
import DeleteScheduleModal from "../_components/Schedule/DeleteScheduleModal";

import { useCourseDetails } from "@/hooks/useCourseDetails";
import { useCourseSchedules } from "@/hooks/useCourseSchedules";
import {
  SectionUI,
  LessonUI,
  UpdateLessonInput,
  UpdateLessonResponse,
  RemoveLessonResp,
  CourseUI,
  ResourceUI,
  ScheduleUI,
} from "@/libs/types/course/types";

import CreateLessonModal from "../../lessons/CreateLessonModal";
import EditLessonModal from "../../lessons/EditLessonModal";
import DeleteLessonModal from "../../lessons/DeleteLessonModal";
import CreateAssignmentModal from "../../assignments/CreateAssignmentModal";

import SubmissionsModal, {
  type SubmissionsModalTarget,
} from "../_components/Assignments/SubmissionsModal";
import AssignmentsTab from "../_components/Assignments/AssignmentsTab";

import AttendanceStatsCard from "@/components/attendance/AttendanceStatsCard";
import { useAttendanceStats } from "@/hooks/useAttendanceStats";

import { gqlFetchAuth } from "@/libs/graphql";
import { REMOVE_LESSON, UPDATE_LESSON } from "@/graphql/mutation/lessons/lesson";
import { buildDownloadUrl } from "@/libs/buildDownloadUrl";
import { uploadFilesToB2 } from "@/services/b2Upload";

type CourseDetailsClientProps = {
  courseId: string;
};

export default function CourseDetailsClient({
  courseId,
}: CourseDetailsClientProps) {
  const { course, loading, error, removeSectionById, removeResourceById, reload } =
    useCourseDetails(courseId);

  const {
    schedules,
    removeScheduleById,
    reload: reloadSchedules,
  } = useCourseSchedules(courseId);

  const { data: attendanceStats, isLoading: attendanceStatsLoading } =
    useAttendanceStats(courseId);

  const [activeTab, setActiveTab] = React.useState<CourseDetailTab>("sections");

  /* ───────── Schedule modals ───────── */

  const [createScheduleOpen, setCreateScheduleOpen] = React.useState(false);
  const [editingSchedule, setEditingSchedule] = React.useState<ScheduleUI | null>(
    null
  );
  const [deletingSchedule, setDeletingSchedule] = React.useState<ScheduleUI | null>(
    null
  );
  const [deleteScheduleLoading, setDeleteScheduleLoading] = React.useState(false);
  const [deleteScheduleErr, setDeleteScheduleErr] = React.useState<string | null>(
    null
  );

  /* ───────── Resource modals ───────── */

  const [createResourceOpen, setCreateResourceOpen] = React.useState(false);
  const [editingResource, setEditingResource] = React.useState<ResourceUI | null>(
    null
  );
  const [deletingResource, setDeletingResource] = React.useState<ResourceUI | null>(
    null
  );
  const [deleteResourceLoading, setDeleteResourceLoading] = React.useState(false);
  const [deleteResourceErr, setDeleteResourceErr] = React.useState<string | null>(
    null
  );

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

  /* ───────── Assignment modals ───────── */

  const queryClient = useQueryClient();

  const [createAssignmentOpen, setCreateAssignmentOpen] = React.useState(false);
  const [assignmentContext, setAssignmentContext] = React.useState<{
    sectionId?: string;
    lessonId?: string;
  }>({});
  const [viewingSubmissionsFor, setViewingSubmissionsFor] =
    React.useState<SubmissionsModalTarget | null>(null);

  /* ───────── Lesson video preview ───────── */

  const [previewLesson, setPreviewLesson] = React.useState<{
    title: string;
    videoUrl: string;
  } | null>(null);

  /* ───────── Navigation ───────── */

  const handleBackClick = React.useCallback(() => {
    window.history.back();
  }, []);

  /* ───────── Section handlers ───────── */

  const handleAddSectionClick = React.useCallback(() => {
    setAddOpen(true);
  }, []);

  /* ───────── Resource handlers ───────── */

  const handleAddResourceClick = React.useCallback(() => {
    setCreateResourceOpen(true);
  }, []);

  const handleResourceCreated = React.useCallback(async () => {
    await reload();
  }, [reload]);

  const handleResourceUpdated = React.useCallback(async () => {
    setEditingResource(null);
    await reload();
  }, [reload]);

  const handleDeleteResourceRequest = React.useCallback((resource: ResourceUI) => {
    setDeletingResource(resource);
    setDeleteResourceErr(null);
  }, []);

  const handleDeleteResourceCancel = React.useCallback(() => {
    if (deleteResourceLoading) return;
    setDeletingResource(null);
    setDeleteResourceErr(null);
  }, [deleteResourceLoading]);

  const handleDeleteResourceConfirm = React.useCallback(async () => {
    if (!deletingResource) return;

    try {
      setDeleteResourceLoading(true);
      setDeleteResourceErr(null);
      await removeResourceById(deletingResource.id);
      setDeletingResource(null);
    } catch (err: unknown) {
      console.error(err);
      setDeleteResourceErr(err instanceof Error ? err.message : "Failed to delete resource.");
    } finally {
      setDeleteResourceLoading(false);
    }
  }, [removeResourceById, deletingResource]);

  /* ───────── Schedule handlers ───────── */

  const handleAddScheduleClick = React.useCallback(() => {
    setCreateScheduleOpen(true);
  }, []);

  const handleScheduleCreated = React.useCallback(async () => {
    await reloadSchedules();
  }, [reloadSchedules]);

  const handleScheduleUpdated = React.useCallback(async () => {
    setEditingSchedule(null);
    await reloadSchedules();
  }, [reloadSchedules]);

  const handleDeleteScheduleRequest = React.useCallback((schedule: ScheduleUI) => {
    setDeletingSchedule(schedule);
    setDeleteScheduleErr(null);
  }, []);

  const handleDeleteScheduleCancel = React.useCallback(() => {
    if (deleteScheduleLoading) return;
    setDeletingSchedule(null);
    setDeleteScheduleErr(null);
  }, [deleteScheduleLoading]);

  const handleDeleteScheduleConfirm = React.useCallback(async () => {
    if (!deletingSchedule) return;

    try {
      setDeleteScheduleLoading(true);
      setDeleteScheduleErr(null);
      await removeScheduleById(deletingSchedule.id);
      setDeletingSchedule(null);
    } catch (err) {
      console.error(err);
      setDeleteScheduleErr(err instanceof Error ? err.message : "Failed to cancel class.");
    } finally {
      setDeleteScheduleLoading(false);
    }
  }, [removeScheduleById, deletingSchedule]);

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
    } catch (err: unknown) {
      console.error(err);
      setDeleteErr(err instanceof Error ? err.message : "Failed to delete section.");
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

  /* ───────── Assignment handlers ───────── */

  const handleCreateGeneralAssignment = React.useCallback(() => {
    setAssignmentContext({});
    setCreateAssignmentOpen(true);
  }, []);

  const handleCreateAssignmentForSection = React.useCallback((sectionId: string) => {
    setAssignmentContext({ sectionId });
    setCreateAssignmentOpen(true);
  }, []);

  const handleCreateAssignmentForLesson = React.useCallback(
    (sectionId: string, lessonId: string) => {
      setAssignmentContext({ sectionId, lessonId });
      setCreateAssignmentOpen(true);
    },
    []
  );

  const handleAssignmentCreated = React.useCallback(async () => {
    await reload();
    await queryClient.invalidateQueries({ queryKey: ["course-assignments", courseId] });
    setCreateAssignmentOpen(false);
    setAssignmentContext({});
  }, [reload, queryClient, courseId]);

  const handleViewSubmissions = React.useCallback(
    (assignment: SubmissionsModalTarget) => {
      setViewingSubmissionsFor(assignment);
    },
    []
  );

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

  /* ───────── Flatten lessons for the schedule modals' lesson picker ───────── */

  const lessonOptions = React.useMemo(() => {
    if (!course) return [];
    return course.sections.flatMap((sec) =>
      (sec.lessons ?? []).map((l) => ({ id: l.id, title: l.title }))
    );
  }, [course]);

  const lessonTitleById = React.useMemo(() => {
    return lessonOptions.reduce<Record<string, string>>((acc, l) => {
      acc[l.id] = l.title;
      return acc;
    }, {});
  }, [lessonOptions]);

  /* ───────── Transform course image (B2 key → full URL) ───────── */

  const courseWithImageUrl: CourseUI | null = React.useMemo(() => {
    if (!course) return null;

    const imagePath =
      typeof course.image === "string" && course.image.trim().length > 0
        ? course.image
        : "";

    const imageUrl = imagePath ? buildDownloadUrl(imagePath) : "";

    return {
      ...course,
      image: imageUrl,
    };
  }, [course]);

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
  async (data: {
    title: string;
    contentType: string;
    duration: string;
    removeVideo?: boolean;
    newVideoFile?: File | null;
  }) => {
    if (!editingLesson) return;

    const durationNum = Number(data.duration);
    if (!Number.isFinite(durationNum) || durationNum <= 0) {
      throw new Error("Lesson duration must be a positive number.");
    }

    // current lesson (existing lessonUrl)
    const current: LessonUI | null = (() => {
      if (!course) return null;
      const sec = course.sections.find((s) => s.id === editingLesson.sectionId);
      return sec?.lessons?.find((l) => l.id === editingLesson.lessonId) ?? null;
    })();

    const existingLessonUrl: string | undefined = current?.lessonUrl || undefined;

    let nextLessonUrl: string | null | undefined = existingLessonUrl;

    // ✅ REPLACE: upload new video
    if (data.newVideoFile) {
      // upload to /lesson/video
      const uploaded = await uploadFilesToB2(
        [data.newVideoFile],
        "lesson/video"
      );

      // B2 returns array of keys/paths
      nextLessonUrl = uploaded?.[0] ?? existingLessonUrl ?? null;
    }

    // ✅ REMOVE (only if no new file selected)
    if (!data.newVideoFile && data.removeVideo) {
      nextLessonUrl = null; // if backend doesn't accept null -> use ""
    }

    const input: UpdateLessonInput & { lessonUrl?: string | null } = {
      _id: editingLesson.lessonId,
      lessonTitle: data.title,
      lessonContentType: data.contentType,
      lessonDuration: durationNum,
    };

    // Only set lessonUrl if we actually want to change it
    // - replace -> string
    // - remove -> null
    if (data.newVideoFile || data.removeVideo) {
      input.lessonUrl = nextLessonUrl; // null or string
    }

    await updateLesson(input);

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
    } catch (err: unknown) {
      console.error(err);
      setDeleteLessonErr(
        err instanceof Error ? err.message : "Failed to delete lesson. Please try again."
      );
    } finally {
      setDeleteLessonLoading(false);
    }
  }, [deletingLesson, reload]);

  /* ───────── Lesson video preview handler ───────── */

  const handlePreviewLesson = React.useCallback(
    (sectionId: string, lessonId: string) => {
      if (!course) return;

      const sec = course.sections.find((s) => s.id === sectionId);
      if (!sec?.lessons) return;

      const lesson = sec.lessons.find((l) => l.id === lessonId);
      if (!lesson) return;

      const key = lesson.lessonUrl || undefined;

      if (!key) {
        alert("This lesson does not have a video.");
        return;
      }

      const fullUrl = key.startsWith("http") ? key : buildDownloadUrl(key);

      setPreviewLesson({
        title: lesson.title,
        videoUrl: fullUrl,
      });
    },
    [course]
  );

  /* ───────── Loading & error states ───────── */

  if (loading) {
    return (
      <PageShell onBack={handleBackClick}>
        <div className="mt-6 space-y-6">
          <div className="h-44 rounded-2xl bg-gray-100 animate-pulse" />
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_8px_24px_rgba(251,133,0,0.08)] space-y-3">
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/3" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </PageShell>
    );
  }

  if (error || !course) {
    return (
      <PageShell onBack={handleBackClick}>
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
          <div className="font-extrabold text-red-900">Course not found</div>
          <p className="mt-1 text-sm text-red-800">
            {error || "This course may have been removed."}
          </p>
        </div>
      </PageShell>
    );
  }

  /* ───────── Main render ───────── */

  return (
    <PageShell onBack={handleBackClick}>
      <div className="mt-6">
        <CourseHeaderCard
          course={courseWithImageUrl || course}
          onAddSection={handleAddSectionClick}
          onAddResource={handleAddResourceClick}
          onAddSchedule={handleAddScheduleClick}
        />

        <CourseDetailTabs active={activeTab} onChange={setActiveTab} />

        <div>
          {activeTab === "sections" && (
            <SectionsBlock
              courseId={courseId}
              sections={course.sections}
              enrolledMemberIds={course.enrolledMemberIds}
              onAddLesson={handleAddLesson}
              onEditSection={handleEditSection}
              onDeleteSection={handleDeleteSectionRequest}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onReorderLessons={handleReorderLessons}
              onPreviewLesson={handlePreviewLesson}
              onCreateAssignmentForSection={handleCreateAssignmentForSection}
              onCreateAssignmentForLesson={handleCreateAssignmentForLesson}
              onCreateGeneralAssignment={handleCreateGeneralAssignment}
              onViewSubmissions={handleViewSubmissions}
            />
          )}

          {activeTab === "resources" && (
            <ResourcesBlock
              resources={course.resources}
              onEdit={setEditingResource}
              onDelete={handleDeleteResourceRequest}
            />
          )}

          {activeTab === "schedule" && (
            <ScheduleBlock
              schedules={schedules}
              lessonTitleById={lessonTitleById}
              onEdit={setEditingSchedule}
              onDelete={handleDeleteScheduleRequest}
            />
          )}

          {activeTab === "attendance" && (
            <AttendanceStatsCard stats={attendanceStats} loading={attendanceStatsLoading} />
          )}

          {activeTab === "assignments" && (
            <AssignmentsTab courseId={courseId} onAddAssignment={handleCreateGeneralAssignment} />
          )}
        </div>
      </div>

      {/* Resource create */}
      <CreateResourceModal
        open={createResourceOpen}
        onClose={() => setCreateResourceOpen(false)}
        courseId={course.id}
        onSuccess={handleResourceCreated}
      />

      {/* Resource edit */}
      <EditResourceModal
        open={!!editingResource}
        onClose={() => setEditingResource(null)}
        resource={editingResource}
        onSuccess={handleResourceUpdated}
      />

      {/* Resource delete */}
      <DeleteResourceModal
        open={!!deletingResource}
        title={deletingResource?.title || ""}
        loading={deleteResourceLoading}
        error={deleteResourceErr}
        onCancel={handleDeleteResourceCancel}
        onConfirm={handleDeleteResourceConfirm}
      />

      {/* Schedule create */}
      <CreateScheduleModal
        open={createScheduleOpen}
        onClose={() => setCreateScheduleOpen(false)}
        courseId={course.id}
        lessonOptions={lessonOptions}
        onSuccess={handleScheduleCreated}
      />

      {/* Schedule edit */}
      <EditScheduleModal
        open={!!editingSchedule}
        onClose={() => setEditingSchedule(null)}
        schedule={editingSchedule}
        lessonOptions={lessonOptions}
        onSuccess={handleScheduleUpdated}
      />

      {/* Schedule delete */}
      <DeleteScheduleModal
        open={!!deletingSchedule}
        title={
          deletingSchedule?.startAt?.[0]
            ? new Date(deletingSchedule.startAt[0]).toLocaleString()
            : ""
        }
        loading={deleteScheduleLoading}
        error={deleteScheduleErr}
        onCancel={handleDeleteScheduleCancel}
        onConfirm={handleDeleteScheduleConfirm}
      />

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
        initialDuration={lessonBeingEdited?.duration || ""}
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

      {/* Assignment create */}
      <CreateAssignmentModal
        open={createAssignmentOpen}
        onClose={() => {
          setCreateAssignmentOpen(false);
          setAssignmentContext({});
        }}
        courseId={courseId}
        sectionId={assignmentContext.sectionId}
        lessonId={assignmentContext.lessonId}
        onSuccess={handleAssignmentCreated}
      />

      {/* Assignment submissions / grading */}
      <SubmissionsModal
        open={!!viewingSubmissionsFor}
        onClose={() => setViewingSubmissionsFor(null)}
        assignment={viewingSubmissionsFor}
      />

      {/* Lesson video preview modal */}
      {previewLesson && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full overflow-hidden shadow-2xl relative">
            <button
              className="absolute right-4 top-4 text-slate-100 bg-black/40 rounded-full px-2 py-1 text-xs hover:bg-black/60"
              onClick={() => setPreviewLesson(null)}
            >
              ✕
            </button>

            <div className="px-4 pt-4 pb-2 bg-slate-950 text-slate-50">
              <h2 className="text-sm font-semibold truncate">
                {previewLesson.title}
              </h2>
            </div>

            <div className="bg-black">
              <video
                src={previewLesson.videoUrl}
                controls
                className="w-full max-h-[70vh] bg-black"
              />
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}