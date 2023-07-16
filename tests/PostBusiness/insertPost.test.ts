import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from '../mocks/PostDatabaseMock'


describe("insertPost",()=>{

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Deve criar um post", async()=>{
        const input = {token: 'token-mock-normal', content:'teste'}
        
        const response = await postBusiness.createPost(input)

        expect(response).toBeTruthy()
        
    })

    test("Deve retornar um erro com 'token' inválido", ()=>{
        const input = {token: 'token-mock', content:'teste'}
        
        expect(async()=>{
            await postBusiness.createPost(input)
        }).rejects.toThrow("'token' inválido")
    })
})