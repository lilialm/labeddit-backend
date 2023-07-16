import { BaseDatabase } from "../../src/database/BaseDatabase"
import { TUserDB, USER_ROLES } from "../../src/types"

export class UserDatabaseMock extends BaseDatabase {
    public static TABLE_USERS = "users"

    public insert = async (userDB: TUserDB): Promise<void> => {
       
    }

    public findByEmail = async (email: string): Promise<TUserDB | undefined>  => {
        switch (email) {
            case "normal@email.com":
                return {
                    id: "id-mock",
                    name: "Normal Mock",
                    email: "normal@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.NORMAL,
                    created_at: new Date().toISOString()
                }
            case "admin@email.com":
                return {
                    id: "id-mock",
                    name: "Admin Mock",
                    email: "admin@email.com",
                    password: "hash-bananinha",
                    role: USER_ROLES.ADMIN,
                    created_at: new Date().toISOString()
                }
            default:
                return undefined
        }
    }
}