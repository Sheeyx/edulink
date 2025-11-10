// src/graphql/member/mutations.ts
export const UPDATE_MEMBER = /* GraphQL */ `
  mutation UpdateMember($input: MemberUpdate!) {
    updateMember(input: $input) {
      _id
      memberRole
      memberStatus
      memberAuth
      memberEmail
      memberPhone
      memberFullName
      memberImage
      memberBio
      memberPoints
      memberRank
      memberLikes
      memberCoursesCompleted
      createdAt
      updatedAt
      accessToken
      refreshToken
      accessTokenExpiresIn
      refreshTokenExpiresIn
      memberMedals {
        medalType
        awardedAt
      }
    }
  }
`;
