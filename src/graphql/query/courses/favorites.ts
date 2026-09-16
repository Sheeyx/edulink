// src/graphql/query/courses/favorites.ts

// Light-weight: just the ids, used to mark which courses are already
// liked across a grid/detail page (getFavorites has no dedicated
// "check like" query on the backend, so we derive it from the list).
export const GET_FAVORITE_IDS = /* GraphQL */ `
  query GetFavoriteIds($input: CoursesInquiry!) {
    getFavorites(input: $input) {
      list {
        _id
      }
      metaCounter {
        total
      }
    }
  }
`;

// Full card fields, used by the "My Favorites" page.
//
// NOTE: deliberately does NOT request memberData. The backend's
// getFavoriteCourses aggregation (like.service.ts) has a bug — it looks
// up the mentor via a "memberId" field that doesn't exist on Course
// (the real field is "mentorId"), and the resulting $lookup is never
// $unwind-ed, so memberData resolves as an empty array instead of a
// nullable Member object, which throws "Cannot return null for
// non-nullable field Member._id." Omitting the field here sidesteps
// that path entirely; toCourseCardModel already falls back to a
// generic "Instructor" label when memberData is absent.
export const GET_FAVORITES = /* GraphQL */ `
  query GetFavorites($input: CoursesInquiry!) {
    getFavorites(input: $input) {
      list {
        _id
        courseTitle
        courseDesc
        courseImage
        languageType
        courseLevel
        coursePrice
        courseRating
        courseLikes
        createdAt
        updatedAt
      }
      metaCounter {
        total
      }
    }
  }
`;
