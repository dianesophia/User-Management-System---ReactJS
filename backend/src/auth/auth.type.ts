import { User } from "../users/users.entity";

export type UserWithToken = {
    user: User,
    token: {
        assessToken: string,
        refreshToken: string
    }
}

