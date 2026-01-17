import { AuthService } from "./auth.service";
import { 
  Body, 
  Controller, 
  Post, 
  Get, 
  UseGuards, 
  Request, 
  HttpCode, 
  HttpStatus 
} from "@nestjs/common";
import { LoginDto, RefreshTokenDto, RegisterDto } from "./dto/auth.dto";
import { JWTAuthGuard } from "./auth.guard";
import { ApiBearerAuth, ApiBody } from "@nestjs/swagger";


@Controller('auth')
export class AuthController{
  constructor(private readonly authService: AuthService){ }

  @Post('register')
  async register(
    @Body() body: RegisterDto,
  ){
    const user = await this.authService.register(body);
    return user;
  };



   @Post('login')
   @HttpCode(HttpStatus.OK)
     @ApiBody({ type: LoginDto })
  async login(
    @Body() body: LoginDto,
  ){
    const user = await this.authService.login(body);
    return user;
  };

     @Post('refresh')
   @HttpCode(HttpStatus.OK)
     @ApiBody({ type: RefreshTokenDto })
  async refresh(
    @Body() body: RefreshTokenDto,
  ){
    const user = await this.authService.refresh(body);
    return user;
  };

@Post('logout')
@HttpCode(HttpStatus.OK)
@ApiBody({ type: RefreshTokenDto })
async logout(@Body() body: RefreshTokenDto) {
  const result = await this.authService.logout();
  return result;
}



  @Get('user')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JWTAuthGuard)
  async user(@Request() req) {
    return {
      message: 'You are authenticated ✅',
      user: req.user,
    };
  }
}


