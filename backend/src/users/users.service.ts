import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { NotFoundException } from "@nestjs/common";

export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userResponsitory: Repository<User>
  ){};


  public async getUser(id: string): Promise<User> {
    const user = await this.userResponsitory.findOne({
      where: {
        id,
      }
    });

    console.log("user service:", user);

    if(!user){
      throw new NotFoundException("User is not found");
    }

    return user;
  }
}