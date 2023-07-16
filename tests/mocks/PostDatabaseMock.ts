import { TPostDB, TLikeDislikeDB, TPostWithCreatorDB, POST_LIKE } from "../../src/types"
import { BaseDatabase } from "../../src/database/BaseDatabase"

export class PostDatabaseMock extends BaseDatabase{
    public static POSTS_TABLE = "posts"
    public static LIKEDISLIKE_TABLE = "likes_dislikes"

    public getPostsWithCreators = async ():Promise<TPostWithCreatorDB[]> => {
        return[
            {
                id: 'p001',
                creator_id: 'id-mock',
                content: 'content-1',
                likes: 1,
                dislikes: 1,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                creator_name: "creator-name"
            },
            {
                id: 'p002',
                creator_id: 'id-mock',
                content: 'content-2',
                likes: 0,
                dislikes: 0,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                creator_name: "creator-name"
            }
        ]
    }

    public findPostsWithCreatorsById = async (postId: string):Promise<TPostWithCreatorDB| undefined>=>{
        if(postId === 'p001'){
        return{
                id: 'p001',
                creator_id: 'id-mock',
                content: 'content-1',
                likes: 1,
                dislikes: 1,
                created_at: expect.any(String),
                updated_at: expect.any(String),
                creator_name: "creator-name"
            }
        }
    }

    public findById = async (id: string):Promise<TPostDB | undefined>=>{
        if(id === 'p001'){
            return{
                    id: 'p001',
                    creator_id: 'id-mock',
                    content: 'comentario1',
                    likes: 1,
                    dislikes: 1,
                    created_at: expect.any(String),
                    updated_at: expect.any(String)
                }
            }
    }

    public insert = async(newPostDB: TPostDB):Promise<void>=>{
      
    }

    public update = async(id: string, postDB: TPostDB):Promise<void>=>{

    }

    public delete = async(id:string):Promise<void>=>{
    }

    public likeOrDislike = async (likeDislike: TLikeDislikeDB): Promise<void> => {
    }

    public findLikeDislike = async (likeDislikeToFind: TLikeDislikeDB): Promise<POST_LIKE | null> => {
        if (likeDislikeToFind.like === 1) {
            return POST_LIKE.ALREADY_LIKED
        } else if (likeDislikeToFind.like === 0) {
            return POST_LIKE. ALREADY_DISLIKED
        } else {
            return null
        }
    }

    public removeLikeDislike = async (likeDislikeDB: TLikeDislikeDB): Promise<void> => {
    }

    public updateLikeDislike = async (likeDislikeDB: TLikeDislikeDB): Promise<void> => {
    }
}