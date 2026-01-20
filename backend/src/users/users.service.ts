import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto, UpdateUserDto } from 'src/auth/dto/users.dto';
import { PasswordUtility } from 'src/common/password.utility';


@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly passwordUtility: PasswordUtility
  ){};


  public async getUser(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      }
    });

    if(!user){
      throw new NotFoundException("User is not found");
    }

    return user;
  }



  public async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

 
 public async findOne(id: string): Promise<User> {
  const user = await this.userRepository.findOne({ where: { id } });
  if (!user) {
    throw new NotFoundException(`User with id ${id} not found`);
  }
  return user;
}

  // new user
  public async create(body: CreateUserDto): Promise<User> {
    const user = this.userRepository.create({
      ...body,
      password: this.passwordUtility.encodePassword(body.password),
    });
    return this.userRepository.save(user);
  }

  // Update user
  public async update(id: string, body: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    if (body.password) {
      body.password = this.passwordUtility.encodePassword(body.password);
    }

    Object.assign(user, body);
    return this.userRepository.save(user);
  }

  
// Soft delete 
  public async remove(id: string): Promise<User> {

    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    } 
    await this.userRepository.softDelete(id);
    
    return user;
  }

}