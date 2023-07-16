import { BaseDatabase } from "../../src/database/BaseDatabase";
import {
  COMMENT_LIKE,
  TCommentDB,
  TCommentWithCreatorDB,
  TLikeDislikeCommentDB,
} from "../../src/types";

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";

  public getComments = async (id: string): Promise<TCommentWithCreatorDB[]> => {
    return [
      {
        id: "id-comment-1",
        creator_id: "creator-id",
        content: "content",
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        post_id: "post-id",
        creator_name: "creator-name",
      },
      {
        id: "id-comment-2",
        creator_id: "creator-id",
        content: "content",
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        post_id: "post-id",
        creator_name: "creator-name",
      },
    ];
  };

  public insert = async (newCommentDB: TCommentDB): Promise<TCommentDB> => {
    return {
      id: "id-comment-1",
      creator_id: "creator-id",
      content: "content",
      likes: 0,
      dislikes: 0,
      created_at: new Date().toISOString(),
      post_id: "post-id",
    };
  };

  public findById = async (id: string): Promise<TCommentDB | undefined> => {
    if (id === "id-comment-1") {
      return {
        id: "id-comment-1",
        creator_id: "creator-id",
        content: "content",
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        post_id: "post-id",
      };
    } else {
      return undefined;
    }
  };

  public delete = async (id: string): Promise<void> => {
  };

  public findCommentWithCreatorById = async (commentId: string): Promise<TCommentWithCreatorDB | undefined> => {
    if (commentId === "id-commment-1") {
      return {
        id: "id-comment-1",
        creator_id: "creator-id",
        content: "content",
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        post_id: "post-id",
        creator_name: "creator-name",
      };
    } else {
      return undefined;
    }
  };

  public likeOrDislike = async (likeDislike: TLikeDislikeCommentDB): Promise<void> => {
  };

  public findLikeDislike = async (likeDislikeToFind: TLikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {
    if (likeDislikeToFind.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED;
    } else if (likeDislikeToFind.like === 0) {
      return COMMENT_LIKE.ALREADY_DISLIKED;
    } else {
      return null;
    }
  };

  public removeLikeDislike = async (likeDislikeDB: TLikeDislikeCommentDB): Promise<void> => {
  };

  public updateLikeDislike = async (likeDislikeDB: TLikeDislikeCommentDB): Promise<void> => {
  };

  public update = async (id: string, commentDB: TCommentDB): Promise<void> => {
  };
}
