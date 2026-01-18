import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
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
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  // Get a user by ID (Admin only)
  @Get(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  //Create a new user (Admin only)
  @Post()
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
    @ApiBody({ type: CreateUserDto })
  create(@Body() body: CreateUserDto) {
    return this.usersService.create(body);
  }

   //  Update ANY user (Admin only)
  @Put(':id')
  @Roles(Role.ADMIN)
  @ApiBody({ type: AdminUpdateDto })
  updateUser(
    @Param('id') id: string,
    @Body() body: AdminUpdateDto,
  ) {
    return this.usersService.update(id, body);
  }

  //  Delete a user (Admin only)
  @Delete(':id')
  @UseGuards(JWTAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  // User updates own profile
  @Put('me')
  @UseGuards(JWTAuthGuard, RolesGuard)
   @ApiBody({ type: UpdateUserDto })
  
  update(
    @Param('id') id: string,
    @Body() body: UpdateUserDto) 
    {
    return this.usersService.update(id, body);
  }

}