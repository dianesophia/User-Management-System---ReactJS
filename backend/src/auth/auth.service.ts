import { ConflictException, Injectable } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { RegisterDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';

export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly authhelper: AuthHelper
  ) {}  
  public async register(body: RegisterDto): Promise<User> {
    const {email, firstName, lastName, gender, phoneNumber, password} = body;
    const existingUser = await this.userRepository.findOne({where: {email}}); 

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const user = new User();
      user.email = email;
      user.firstName = firstName;
      user.lastName = lastName;
      user.gender = gender;
      user.phoneNumber = phoneNumber;
      user.password = this.authhelper.encodePassword(password); 
    


    return await this.userRepository.save(user);
  }
}