// src/graphql/mutation/videoProgress/videoProgress.ts

const VIDEO_PROGRESS_FIELDS = /* GraphQL */ `
  _id
  memberId
  lessonId
  videoDuration
  watchedTime
  progressPercentage
  isCompleted
  readyToComplete
  lastWatchedTime
  createdAt
  updatedAt
`;

// startVideo takes the lessonId directly as a bare String! argument (no
// input object) — confirmed via schema introspection, not a typo.
export const START_VIDEO = /* GraphQL */ `
  mutation StartVideo($input: String!) {
    startVideo(input: $input) {
      resumeTime
      progress {
        ${VIDEO_PROGRESS_FIELDS}
      }
    }
  }
`;

export const UPDATE_VIDEO_PROGRESS = /* GraphQL */ `
  mutation UpdateVideoProgress($input: UpdateProgressInput!) {
    updateVideoProgress(input: $input) {
      ${VIDEO_PROGRESS_FIELDS}
    }
  }
`;

// Same bare-String! argument as startVideo.
export const COMPLETE_LESSON = /* GraphQL */ `
  mutation CompleteLesson($input: String!) {
    completeLesson(input: $input) {
      success
      message
    }
  }
`;
