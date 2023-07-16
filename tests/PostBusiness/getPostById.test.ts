import {PostBusiness} from '../../src/business/PostBusiness'
import { IdGeneratorMock } from "../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../mocks/TokenManagerMock"
import { PostDatabaseMock } from '../mocks/PostDatabaseMock'

describe("getPostById",()=>{

    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
    )

    test("Deve listar todos os posts", async()=>{
        const input = {q:'', token: 'token-mock-normal'}
        const output =
            {
                id: 'p001',
                content: 'content-1',
                likes: 1,
                dislikes: 1,
                createdAt: expect.any(String),
                updatedAt: expect.any(String),
                creator: {
                    id: 'id-mock',
                    name: 'creator-name'
                }
            }

        const response = await postBusiness.getPosts(input)

        expect(response).toHaveLength(2)  
        expect(response).toContainEqual(output)

    })

    test("Deve retornar um erro caso não tenha informado um token válido", ()=>{
        const input = {q: '', token: 'token-mock'}

        expect(async()=>{
            await postBusiness.getPosts(input)
        }).rejects.toThrow("'token' inválido")
    })
})