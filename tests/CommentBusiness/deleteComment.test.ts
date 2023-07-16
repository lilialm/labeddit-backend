import {CommentBusiness} from '../../src/business/CommentBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { CommentDatabaseMock } from '../mocks/CommentDatabaseMock'

describe("deleteComment",()=>{

    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Excluir comentário por id", async ()=>{
        const input = {idToDelete:'id-comment-1', token: 'token-mock-admin'}

       const response = await commentBusiness.deleteComment(input)

       expect(response).not.toBe(input)
    })


    test("Retornar um erro caso não encontre um 'id' válido", ()=>{
        const input = {idToDelete:'c000', token: 'token-mock-normal'}

        expect(async()=>{
            await commentBusiness.deleteComment(input)
        }).rejects.toThrow("'id' não encontrada")
    })

    test("Retornar um erro caso não tenha informado um token válido", ()=>{
        const input = {idToDelete:'id-comment-1', token: 'token-mock'}

        expect(async()=>{
            await commentBusiness.deleteComment(input)
        }).rejects.toThrow("'token' inválido")
    })
})