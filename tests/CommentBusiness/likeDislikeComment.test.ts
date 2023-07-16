import {CommentBusiness} from '../../src/business/CommentBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { CommentDatabaseMock } from '../mocks/CommentDatabaseMock'

describe("likeDislikeComment",()=>{

    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Retornar um erro se 'like' não for booleano", ()=>{
        const input = {idToLikeOrDislike:'p001', like: 45, token: 'token-mock-admin'}

        expect(async()=>{
            await commentBusiness.likeOrDislikeComment(input)
        }).rejects.toThrow("'like' deve ser booleano")
    })

    test("Deve retornar um erro com 'token' inválido", ()=>{
        const input = {idToLikeOrDislike:'p001',like:1, token: 'token-mock'}
        
        expect(async()=>{
            await commentBusiness.likeOrDislikeComment(input)
        }).rejects.toThrow("'token' inválido")
    })

})