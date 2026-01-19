import { User } from "../users/users.entity";

export type UserWithToken = {
    user: User,
    token: {
        accessToken: string,
        refreshToken: string
    }
}

