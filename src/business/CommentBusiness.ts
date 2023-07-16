import { CommentDatabase } from "../database/CommentDatabase"
import { TCreateCommentInputDTO, TDeleteCommentInputDTO, TGetCommentsInputDTO, TGetCommentsOutputDTO } from "../dtos/commentDTO"
import { TLikeOrDislikeInputDTO } from "../dtos/postDTO"
import { BadRequestError } from "../errors/BadRequestError"
import { NotFoundError } from "../errors/NotFoundError"
import { Comment } from "../models/Comment"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { COMMENT_LIKE, TCommentDB, TCommentWithCreatorDB, TLikeDislikeCommentDB, USER_ROLES } from "../types"

export class CommentBusiness {
    constructor (
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public getComments = async (input: TGetCommentsInputDTO) : Promise<TGetCommentsOutputDTO> => {
        const {token, id} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentsWithCreatorsDB: TCommentWithCreatorDB[] = await this.commentDatabase.getComments(id)
        const comments = commentsWithCreatorsDB.map((commentDB) => {
            const comment = new Comment (
                commentDB.id,
                commentDB.content,
                commentDB.likes,
                commentDB.dislikes,
                commentDB.created_at,
                commentDB.post_id,
                commentDB.creator_id,
                commentDB.creator_name
            )

            return comment.toBusinessModel()
        })

        const output: TGetCommentsOutputDTO = comments
        return output
    }

    public createComment = async (input: TCreateCommentInputDTO) : Promise<TCommentDB> => {
        const {token, postId, content} = input
        
        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        if (typeof content !== "string") {
            throw new BadRequestError("'content' deve ser string")
        }

        const comment = new Comment(
            this.idGenerator.generate(),
            content,
            0,
            0,
            new Date().toISOString(),
            postId,
            payload.id,
            payload.name
        )

        const commentDB = comment.toDBModel()
        await this.commentDatabase.insert(commentDB)

        return commentDB
        
    }

    public deleteComment = async (input: TDeleteCommentInputDTO) : Promise<string> => {
        const {token, idToDelete} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const commentDB = await this.commentDatabase.findById(idToDelete)

        if (!commentDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = payload.id

        if (
            payload.role !== USER_ROLES.ADMIN &&
            commentDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("Para excluir o post, precisa ser ADMIN ou ter criado o proprio.")        }

        await this.commentDatabase.delete(idToDelete)

        return "Comentário deletado!"
    }

    public likeOrDislikeComment = async (input: TLikeOrDislikeInputDTO) : Promise<String> => {
        const {token, like, idToLikeOrDislike} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        if (typeof like !== "boolean") {
            throw new BadRequestError("'like' deve ser booleano")
        }

        const commentWithCreatorDB = await this.commentDatabase.findCommentWithCreatorById(idToLikeOrDislike)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB : TLikeDislikeCommentDB = {
            user_id: userId,
            comment_id: commentWithCreatorDB.id,
            like: likeSQLite
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.created_at,
            commentWithCreatorDB.post_id,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.creator_name
        )

        const likeDislikedExists = await this.commentDatabase
        .findLikeDislike(likeDislikeDB )

        let output

        if (likeDislikedExists === COMMENT_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeLike()
                output = "Like removido"

            } else {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeLike()
                comment.addDislike()
                output = "Dislike adicionado"
            }

        } else if (likeDislikedExists === COMMENT_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.commentDatabase.updateLikeDislike(likeDislikeDB)
                comment.removeDislike()
                comment.addLike()
                output = "Like adicionado"

            } else {
                await this.commentDatabase.removeLikeDislike(likeDislikeDB)
                comment.removeDislike()
                output = "Dislike removido"
            }
        } else {
            await this.commentDatabase.likeOrDislike(likeDislikeDB)
            // like ? comment.addLike() : comment.addDislike()
            if (like) {
                comment.addLike()
                output = "Like adicionado"
            } else {
                comment.addDislike()
                output = "Dislike adicionado"
            }

        }
        const updatedPostDB = comment.toDBModel()
        await this.commentDatabase.update(idToLikeOrDislike, updatedPostDB)

        return output
    }
}