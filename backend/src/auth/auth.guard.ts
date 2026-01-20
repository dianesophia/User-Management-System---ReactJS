import { ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
    handleRequest<TUser = any>(
        err: any,
        user: TUser,
        info: any,
        context: ExecutionContext,
        status?: any
    ): TUser {
        if (err || !user) {
            throw new ForbiddenException('Access Denied');
        }
        return user; // attaches user to request for RolesGuard
    }
}
