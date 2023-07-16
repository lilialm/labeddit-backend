import {CommentBusiness} from '../../src/business/CommentBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { CommentDatabaseMock } from '../mocks/CommentDatabaseMock'

describe("getComments",()=>{

    const commentBusiness = new CommentBusiness(
        new CommentDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )
    test("Deve listar todos os comentários", async()=>{
        const input = {id: "p001", token: 'token-mock-normal'}
        const output =
            {
                id: "id-comment-1",
                content: "content",
                likes: 0,
                dislikes: 0,
                createdAt: new Date().toISOString(),
                postId: "post-id",
                creator: {
                    id: 'creator-id',
                    name: 'creator-name'
                }
            }

        const response = await commentBusiness.getComments(input)

        expect(response).toHaveLength(2)  
        expect(response).toContainEqual(output)

    })

    test("Deve retornar um erro caso não tenha informado um token válido", ()=>{
        const input = {id: "p001", token: 'token-mock'}

        expect(async()=>{
            await commentBusiness.getComments(input)
        }).rejects.toThrow("'token' inválido")
    })
})