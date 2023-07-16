import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from '../mocks/PostDatabaseMock'

describe("editPost",()=>{

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )


    test("Retornar um erro caso não encontre um 'id' válido", ()=>{
        const input = {idToEdit:'p000', content: 'atualizacao', token: 'token-mock-normal'}

        expect(async()=>{
            await postBusiness.editPost(input)
        }).rejects.toThrow("'id' não encontrada")
    })

    test("Retornar um erro caso não tenha informado um token válido", ()=>{
        const input = {idToEdit:'p001', content: 'atualizacao', token: 'token-mock'}

        expect(async()=>{
            await postBusiness.editPost(input)
        }).rejects.toThrow("'token' inválido")
    })
})