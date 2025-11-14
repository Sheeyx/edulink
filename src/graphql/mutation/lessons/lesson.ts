
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