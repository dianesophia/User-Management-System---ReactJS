import { User } from '../users/users.entity';

declare module 'express'{
    interface Request {
        user?: User;
    }
}