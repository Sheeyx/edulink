// ../components/Sections/CreateSections.tsx (or wherever you defined it)
const CREATE_SECTION = `
  mutation CreateSection($input: SectionInput!) {
    createSection(input: $input) {
      _id
      courseId
      moduleTitle
      moduleOrder
      totalLessons
      sectionStatus
      createdAt
      updatedAt
      lessons {
        _id
        sectionId
        lessonTitle
        lessonContentType
        lessonDuration
        createdAt
        updatedAt
      }
    }
  }
`;


const DELETE_SECTION = `
  mutation RemoveSection($input: String!) {
    removeSection(sectionId: $input) {
      _id
      courseId
      moduleTitle
      moduleOrder
      totalLessons
      deletedAt
      createdAt
      updatedAt
      lessons {
        _id
        sectionId
        lessonTitle
        lessonContentType
        lessonDuration
        lessonVideoUrl
        deletedAt
        createdAt
        updatedAt
      }
      sectionStatus
    }
  }
`;
