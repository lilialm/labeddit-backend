import { PostDatabase } from "../database/PostDatabase";
import { TCreatePostInputDTO, TDeletePostInputDTO, TEditPostInputDTO, TGetPostsInputDTO, TGetPostsOutputDTO, TLikeOrDislikeInputDTO } from "../dtos/postDTO";
import { BadRequestError } from "../errors/BadRequestError";
import { NotFoundError } from "../errors/NotFoundError";
import { Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { POST_LIKE, TLikeDislikeDB, TPostDB, TPostWithCreatorDB, USER_ROLES } from "../types";

export class PostBusiness {
    constructor (
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) {}

    public getPosts = async (input: TGetPostsInputDTO) : Promise<TGetPostsOutputDTO> => {
        const {token} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postsWithCreatorsDB: TPostWithCreatorDB[] = await this.postDatabase.getPostsWithCreators()
        const posts = postsWithCreatorsDB.map((postWithCreatorDB) => {
            const post = new Post (
                postWithCreatorDB.id,
                postWithCreatorDB.content,
                postWithCreatorDB.likes,
                postWithCreatorDB.dislikes,
                postWithCreatorDB.created_at,
                postWithCreatorDB.updated_at,
                postWithCreatorDB.creator_id,
                postWithCreatorDB.creator_name
            )

            return post.toBusinessModel()
        })

        const output: TGetPostsOutputDTO = posts
        return output
    }

    public createPost = async (input: TCreatePostInputDTO) : Promise<TPostDB> => {
        const {token, content} = input

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

        const post = new Post(
            this.idGenerator.generate(),
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const postDB = post.toDBModel()
        await this.postDatabase.insert(postDB)

        return postDB
        
    }

    public editPost = async (input: TEditPostInputDTO) : Promise<TPostDB> => {
        const {token, content, idToEdit} = input

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

        const postDB = await this.postDatabase.findById(idToEdit)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const creatorId = payload.id
        const creatorName = payload.name

        if (postDB.creator_id !== creatorId) {
            throw new BadRequestError("somente quem criou o post pode editá-lo")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.likes,
            postDB.dislikes,
            postDB.created_at,
            postDB.updated_at,
            creatorId,
            creatorName
        )

        post.setContent(content)
        post.setUpdatedAt(new Date().toISOString())

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.update(idToEdit, updatedPostDB)

        return updatedPostDB
        
    }

    public deletePost = async (input: TDeletePostInputDTO) : Promise<string> => {
        const {token, idToDelete} = input

        if (token === undefined) {
            throw new BadRequestError("'token' ausente")
        }

        const payload = this.tokenManager.getPayload(token)
        
        if (payload === null) {
            throw new BadRequestError("'token' inválido")
        }

        const postDB = await this.postDatabase.findById(idToDelete)

        if (!postDB) {
            throw new NotFoundError("'id' não encontrado")
        }

        const creatorId = payload.id

        if (
            payload.role !== USER_ROLES.ADMIN &&
            postDB.creator_id !== creatorId
        ) {
            throw new BadRequestError("Para excluir o post, precisa ser ADMIN ou ter criado o proprio.")        }

        await this.postDatabase.delete(idToDelete)

        return "Post deletado"
    }

    public likeOrDislikePost = async (input: TLikeOrDislikeInputDTO) : Promise<string> => {
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

        const postWithCreatorDB = await this.postDatabase.findPostsWithCreatorsById(idToLikeOrDislike)

        if (!postWithCreatorDB) {
            throw new NotFoundError("'id' não encontrada")
        }

        const userId = payload.id
        const likeSQLite = like ? 1 : 0

        const likeDislikeDB : TLikeDislikeDB = {
            user_id: userId,
            post_id: postWithCreatorDB.id,
            like: likeSQLite
        }

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.created_at,
            postWithCreatorDB.updated_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name
        )

        const likeDislikedExists = await this.postDatabase
        .findLikeDislike(likeDislikeDB )

        let output

        if (likeDislikedExists === POST_LIKE.ALREADY_LIKED) {
            if (like) {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeLike()
                output = "Like removido"
            } else {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeLike()
                post.addDislike()
                output = "Dislike removido"
            }

        } else if (likeDislikedExists === POST_LIKE.ALREADY_DISLIKED) {
            if (like) {
                await this.postDatabase.updateLikeDislike(likeDislikeDB)
                post.removeDislike()
                post.addLike()
                output = "Like adicionado"

            } else {
                await this.postDatabase.removeLikeDislike(likeDislikeDB)
                post.removeDislike()
                output = "Dislike removido"

            }
        } else {
            await this.postDatabase.likeOrDislike(likeDislikeDB)
            if (like) {
                post.addLike()
                output = "Like adicionado"
            } else {
                post.addDislike()
                output = "Dislike adicionado"
            }

        }

        const updatedPostDB = post.toDBModel()
        await this.postDatabase.update(idToLikeOrDislike, updatedPostDB)

        return output
    }
}