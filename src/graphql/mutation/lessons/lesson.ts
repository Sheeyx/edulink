
export const CREATE_LESSON = `
  mutation CreateLesson($input: LessonInput!) {
    createLesson(input: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      deletedAt
      createdAt
      updatedAt
    }
  }
`;


export const UPDATE_LESSON = `
  mutation UpdateLesson($input: LessonUpdate!) {
    updateLesson(input: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      deletedAt
      createdAt
      updatedAt
    }
  }
`;

// src/graphql/mutations/lessons/removeLesson.ts
export const REMOVE_LESSON = `
  mutation RemoveLesson($input: String!) {
    removeLesson(lessonId: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      deletedAt
      createdAt
      updatedAt
    }
  }
`;


