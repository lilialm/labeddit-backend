import { TCommentWithCreatorDB, TCommentDB, TLikeDislikeCommentDB, COMMENT_LIKE } from "../types"
import { BaseDatabase } from "./BaseDatabase"

export class CommentDatabase extends BaseDatabase {
    public static TABLE_COMMENTS = "comments"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments"

    public getComments = async (id: string): Promise<TCommentWithCreatorDB[]> => {
        const result: TCommentWithCreatorDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            "comments.id",
            "comments.creator_id",
            "comments.content",
            "comments.likes",
            "comments.dislikes",
            "comments.created_at",
            "comments.post_id",
            "users.name AS creator_name"
        )
        .join("users", "comments.creator_id", "=", "users.id")
        .join("posts", "comments.post_id", "=", "posts.id")
        .where("comments.post_id", id)

        return result
    }
    
    public insert = async (newCommentDB: TCommentDB): Promise<TCommentDB> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .insert(newCommentDB)

        return newCommentDB
    }

    public findById = async (id: string): Promise<TCommentDB | undefined> => {
        const result: TCommentDB[] = await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .select()
            .where({id})

            return result[0]
    }

    public delete = async (id: string): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .delete()
            .where({ id })
    }

    public findCommentWithCreatorById = async (commentId: string) : Promise<TCommentWithCreatorDB | undefined> => {
        const result: TCommentWithCreatorDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
            "comments.id",
            "comments.creator_id",
            "comments.content",
            "comments.likes",
            "comments.dislikes",
            "comments.created_at",
            "comments.post_id",
            "users.name AS creator_name"
        )
        .join("users", "comments.creator_id", "=", "users.id")
        .join("posts", "comments.post_id", "=", "posts.id")
        .where("comments.id", commentId)

        return result[0]
    }

    public likeOrDislike = async (likeDislike: TLikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislike)
    }

    public findLikeDislike = async (likeDislikeToFind: TLikeDislikeCommentDB): Promise<COMMENT_LIKE | null> => {
        const [ likeDislikeDB ]: TLikeDislikeCommentDB[] = await BaseDatabase
        .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .select()
        .where({
            user_id: likeDislikeToFind.user_id,
            comment_id: likeDislikeToFind.comment_id
        })

        if (likeDislikeDB) {
            return likeDislikeDB.like === 1 ? COMMENT_LIKE.ALREADY_LIKED : COMMENT_LIKE.ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: TLikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .delete()
        .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
        })
    }

    public updateLikeDislike = async (likeDislikeDB: TLikeDislikeCommentDB): Promise<void> => {
        await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES)
        .update(likeDislikeDB)
        .where({
            user_id: likeDislikeDB.user_id,
            comment_id: likeDislikeDB.comment_id
        })
    }

    public update = async (id: string, commentDB: TCommentDB): Promise<void> => {
        await BaseDatabase
            .connection(CommentDatabase.TABLE_COMMENTS)
            .update(commentDB)
            .where({ id })
    }

}