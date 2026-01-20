import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException, Request } from '@nestjs/common';
import { UserService } from './users.service';
import { CreateUserDto, AdminUpdateDto, UpdateUserDto } from '../auth/dto/users.dto';
import { JWTAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { RolesGuard } from '../auth/roles/roles.guard';
import { Role } from './enums/role.enum';
import { ApiBearerAuth } from '@nestjs/swagger/dist/decorators/api-bearer.decorator';
import { ApiTags } from '@nestjs/swagger/dist/decorators/api-use-tags.decorator';
import { ApiBody } from '@nestjs/swagger/dist/decorators/api-body.decorator';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JWTAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UserService) {}

  // Get all users (Admin only)
  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // Get a user by ID (Admin only)
  @Get(':id')
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //new user (Admin only)
  @Post()
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateUserDto })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

   // updates profile (any authenticated user can update their own profile)
  @Put('me')
  @ApiBody({ type: UpdateUserDto })
  update(
    @Request() req: any,
    @Body() body: UpdateUserDto) 
    {
    return this.usersService.update(req.user.id, body);
  }

  //  Update user (Admin only)
  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBody({ type: AdminUpdateDto })
  updateUser(
    @Param('id') id: string,
    @Body() body: AdminUpdateDto,
  ) {
    return this.usersService.update(id, body);
  }

  //  delete user (Admin only)
  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

}