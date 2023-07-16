import {CommentBusiness} from '../../src/business/CommentBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { CommentDatabaseMock } from '../mocks/CommentDatabaseMock'


describe("createComment",()=>{
    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Criar um comentário", async()=>{
        const input = {postId: 'p001',token: 'token-mock-normal', content:'teste'}
        
        const response = await commentBusiness.createComment(input)

        expect(response).toBeTruthy()
    })

    test("Retornar um erro com 'token' inválido", ()=>{
        const input = {postId: 'p001',token: 'token-mock', content:'teste'}
        
        expect(async()=>{
            await commentBusiness.createComment(input)
        }).rejects.toThrow("'token' inválido")
    })

})