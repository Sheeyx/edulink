"use client";

import * as React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { gqlFetchAuth } from "@/libs/graphql";
import { GET_COMMENTS_BY_COURSE } from "@/graphql/query/comments/comments";
import { CREATE_COMMENT, ADD_COMMENT_REPLY, DELETE_COMMENT } from "@/graphql/mutation/comments/comments";

export type CommentMemberData = {
  _id: string;
  memberFullName?: string | null;
  memberImage?: string | null;
};

export type CommentReply = {
  memberId: string;
  repliesComment: string;
  createdAt: string;
  memberData?: CommentMemberData | null;
};

export type Comment = {
  _id: string;
  memberId: string;
  courseId: string;
  comment: string;
  commentLikes: number;
  createdAt: string;
  memberData?: CommentMemberData | null;
  commentReplies: CommentReply[];
};

type ListResp = { getCommentsByCourse: { totalCount: number; list: Comment[] } };
type CreateResp = { createComment: Comment };
type ReplyResp = { addCommentReply: Comment };
type DeleteResp = { deleteComment: boolean };

const PAGE_LIMIT = 20;

export function useComments(courseId: string | undefined, enabled: boolean) {
  const queryClient = useQueryClient();
  const queryKey = React.useMemo(() => ["user", "courseComments", courseId], [courseId]);

  const query = useQuery({
    queryKey,
    queryFn: async (): Promise<{ totalCount: number; list: Comment[] }> => {
      const res = await gqlFetchAuth<ListResp>(GET_COMMENTS_BY_COURSE, {
        input: { courseId, page: 1, limit: PAGE_LIMIT },
      });
      return res.getCommentsByCourse;
    },
    enabled: enabled && !!courseId,
    staleTime: 15_000,
  });

  const [posting, setPosting] = React.useState(false);

  const postComment = React.useCallback(
    async (comment: string) => {
      if (!courseId || !comment.trim()) return;
      setPosting(true);
      try {
        await gqlFetchAuth<CreateResp>(CREATE_COMMENT, { input: { courseId, comment: comment.trim() } });
        await queryClient.invalidateQueries({ queryKey });
      } finally {
        setPosting(false);
      }
    },
    [courseId, queryClient, queryKey]
  );

  const postReply = React.useCallback(
    async (commentId: string, repliesComment: string) => {
      if (!repliesComment.trim()) return;
      await gqlFetchAuth<ReplyResp>(ADD_COMMENT_REPLY, {
        input: { commentId, repliesComment: repliesComment.trim() },
      });
      await queryClient.invalidateQueries({ queryKey });
    },
    [queryClient, queryKey]
  );

  const removeComment = React.useCallback(
    async (commentId: string) => {
      await gqlFetchAuth<DeleteResp>(DELETE_COMMENT, { commentId });
      await queryClient.invalidateQueries({ queryKey });
    },
    [queryClient, queryKey]
  );

  return {
    comments: query.data?.list || [],
    totalCount: query.data?.totalCount || 0,
    isLoading: query.isLoading,
    isError: query.isError,
    posting,
    postComment,
    postReply,
    removeComment,
  };
}
