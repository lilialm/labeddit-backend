import { TCommentModel } from "../types"

export interface TGetCommentsInputDTO {
    token: string | undefined, 
    id: string
}

export type TGetCommentsOutputDTO = TCommentModel[]

export interface TCreateCommentInputDTO {
    token: string | undefined,
    postId: string,
    content: unknown
}

export interface TDeleteCommentInputDTO {
    idToDelete: string,
    token: string | undefined
}