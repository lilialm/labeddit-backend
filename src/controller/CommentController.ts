import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { TCreateCommentInputDTO, TDeleteCommentInputDTO, TGetCommentsInputDTO } from "../dtos/commentDTO";
import { TLikeOrDislikeInputDTO } from "../dtos/postDTO";
import { BaseError } from "../errors/BaseError";

export class CommentController { 
    constructor (
        private commentBusiness: CommentBusiness
    ) {}

    public getComments = async (req: Request, res: Response) => {
        try {

            const input: TGetCommentsInputDTO = {
                token: req.headers.authorization,
                id: req.params.id
            }

            const output = await this.commentBusiness.getComments(input)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public createComment = async (req: Request, res: Response) => {
        try {
            const input: TCreateCommentInputDTO = {
                token: req.headers.authorization,
                postId: req.params.postId,
                content: req.body.content
            }

            const output = await this.commentBusiness.createComment(input)
    
            res.status(201).send(output)
        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public deleteComment = async (req: Request, res: Response) => {
        try {
            const input: TDeleteCommentInputDTO = {
                token: req.headers.authorization,
                idToDelete: req.params.id
            }

            const output = await this.commentBusiness.deleteComment(input)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }

    public likeOrDislikeComment = async (req: Request, res: Response) => {
        try {
            const input: TLikeOrDislikeInputDTO = {
                token: req.headers.authorization,
                like: req.body.like,
                idToLikeOrDislike: req.params.id
            }

            const output = await this.commentBusiness.likeOrDislikeComment(input)
    
            res.status(200).send(output)
        } catch (error) {
            console.log(error);
            
            if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado")
            }
        }
    }
}