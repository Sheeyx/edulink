export const CREATE_LESSON_MUTATION = `
  mutation CreateLesson($input: LessonInput!) {
    createLesson(input: $input) {
      _id
      sectionId
      lessonTitle
      lessonContentType
      lessonDuration
      lessonUrl
      createdAt
      updatedAt
    }
  }
`;
