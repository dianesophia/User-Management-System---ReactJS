import { ExecutionContext } from "@nestjs/common";
import { AuthGuard, IAuthGuard,  } from "@nestjs/passport"
import { Observable } from "rxjs";
import { User } from "src/users/users.entity";
import { ForbiddenException } from "@nestjs/common";
import { Request } from "express";


export class JWTAuthGuard extends AuthGuard('jwt') implements IAuthGuard{
    public handleRequest(err: unknown, user: User): any{
        if(!user){
            throw new ForbiddenException();
        }
        return user;
    }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        
        await super.canActivate(context);
        const request = context.switchToHttp().getRequest<Request & { user: User }>();
        const user = request.user;

        if(!user){
            return false;
        }

        return true;
    }
}