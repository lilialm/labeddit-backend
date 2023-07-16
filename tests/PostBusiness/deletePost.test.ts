import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from '../mocks/PostDatabaseMock'

describe("deletePost",()=>{

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Excluir post por id", async ()=>{
        const input = {idToDelete:'p001', token: 'token-mock-admin'}

       const response = await postBusiness.deletePost(input)

       expect(response).not.toBe(input)
    })


    test("Retornar um erro caso não encontre um 'id' válido", ()=>{
        const input = {idToDelete:'p000', token: 'token-mock-normal'}

        expect(async()=>{
            await postBusiness.deletePost(input)
        }).rejects.toThrow("'id' não encontrada")
    })

    test("Retornar um erro caso não tenha informado um token válido", ()=>{
        const input = {idToDelete:'p001', token: 'token-mock'}

        expect(async()=>{
            await postBusiness.deletePost(input)
        }).rejects.toThrow("'token' inválido")
    })
})