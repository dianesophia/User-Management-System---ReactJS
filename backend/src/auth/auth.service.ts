import { BadRequestException, ConflictException, Injectable,   NotFoundException  } from '@nestjs/common';
import { User } from 'src/users/users.entity';
import { LoginDto, RegisterDto, RefreshTokenDto } from './dto/auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthHelper } from './auth.helper';
import { UserWithToken } from './auth.type';
import { UserService } from 'src/users/users.service';
import { Role } from 'src/users/enums/role.enum';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly authhelper: AuthHelper,
    private readonly userService: UserService,
    
  ) {}  
  public async register(body: RegisterDto): Promise<UserWithToken> {
    const {email, firstName, lastName, gender, phoneNumber, address, password} = body;
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
      user.address = address;
      user.password = this.authhelper.encodePassword(password); 
    
      user.role = email === 'admin@example.com' ? Role.ADMIN : Role.USER;



     await this.userRepository.save(user);
     return this.authhelper.generateToken(user);
  }


  public async login(body: LoginDto): Promise<UserWithToken> {
    const {email, password} = body;
    const user = await this.userRepository
    .createQueryBuilder('user')
    .where('user.email = :email', {email})
    .getOne();

    if(!user){
      throw new NotFoundException('User not found');
    }

    const isPasswordValid: boolean = this.authhelper.isPasswordValid(password, user.password);

    if(!isPasswordValid){
      throw new BadRequestException("Login details are incorrect");
    }

    return this.authhelper.generateToken(user);
  }

  public async refresh(body: RefreshTokenDto): Promise<UserWithToken> {
    const { refreshToken } = body;
    const user = await this.authhelper.getUserFromToken(refreshToken);  
    return this.authhelper.generateToken(user);
  }


  public async logout(): Promise<{ message: string }> {
    return { message: 'Logged out successfully' };
  }

}