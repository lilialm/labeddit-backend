import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from '../mocks/PostDatabaseMock'

describe("likeDislikePost",()=>{

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Retornar um erro se 'like' não for booleano", ()=>{
        const input = {idToLikeOrDislike:'p001', like: 45, token: 'token-mock-admin'}

        expect(async()=>{
            await postBusiness.likeOrDislikePost(input)
        }).rejects.toThrow("'like' deve ser booleano")
    })

    test("Deve retornar um erro com 'token' inválido", ()=>{
        const input = {idToLikeOrDislike:'p001',like:1, token: 'token-mock'}
        
        expect(async()=>{
            await postBusiness.likeOrDislikePost(input)
        }).rejects.toThrow("'token' inválido")
    })

})