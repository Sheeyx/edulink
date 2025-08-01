import { gql } from '@apollo/client';

/**************************
 *         MEMBER         *
 *************************/

export const SIGN_UP = gql`
	mutation Signup($input: MemberInput!) {
		signup(input: $input) {
			_id
			memberType
			memberStatus
			memberAuthType
			memberPhone
			memberNick
			memberFullName
			memberImage
			memberAddress
			memberDesc
			memberWarnings
			memberBlocks
			memberProperties
			memberRank
			memberArticles
			memberPoints
			memberLikes
			memberViews
			deletedAt
			createdAt
			updatedAt
			accessToken
		}
	}
`;

// CHECK_SOCIAL_USER

const CHECK_SOCIAL_USER = gql`
  query CheckSocial($input: CheckSocialUserInput!) {
    checkSocialIdExists(input: $input) {
      exists
      member {
        id
        memberEmail
      }
    }
  }
`;
