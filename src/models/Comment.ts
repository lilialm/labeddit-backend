import { TCommentDB, TCommentModel } from "../types";

export class Comment {

    constructor (
        private id: string,
        private content: string,
        private likes: number,
        private dislikes: number, 
        private createdAt: string,
        private postId: string,
        private creatorId: string,
        private creatorName: string,
    ) {}

    public getCreatedAt(): string {
        return this.createdAt;
    }
    public setCreatedAt(value: string) {
        this.createdAt = value;
    }
    public getDislikes(): number {
        return this.dislikes;
    }
    public setDislikes(value: number) {
        this.dislikes = value;
    }
    public getLikes(): number {
        return this.likes;
    }
    public setLikes(value: number) {
        this.likes = value;
    }
    public addLike() {
        this.likes += 1;
    }
    public removeLike() {
        this.likes -= 1;
    }
    public addDislike() {
        this.dislikes += 1;
    }
    public removeDislike() {
        this.dislikes -= 1;
    }
    public getContent(): string {
        return this.content;
    }
    public setContent(value: string) {
        this.content = value;
    }
    public getCreatorId(): string {
        return this.creatorId;
    }
    public setCreatorId(value: string) {
        this.creatorId = value;
    }
    public getId(): string {
        return this.id;
    }
    public setId(value: string) {
        this.id = value;
    }
    public getCreatorName(): string {
        return this.creatorName;
    }
    public setCreatorName(value: string) {
        this.creatorName = value;
    }
    public getPostId(): string {
        return this.postId;
    }
    public setPostId(value: string) {
        this.postId = value;
    }

    public toDBModel() : TCommentDB {
        return {
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            post_id: this.postId
        }
    }

    public toBusinessModel() : TCommentModel {
        return {
            id: this.id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            postId: this.postId,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }
}