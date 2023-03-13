import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { IUsers } from './interfaces/users.interface';
import { UserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from 'src/auth/login/interfaces/jwt.payload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async findByEmail(email: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${email} not found`);
    }

    return user;
  }

  public async findById(userId: string): Promise<Users> {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundException(`User #${userId} not found`);
    }

    return user;
  }

  public async create(userDto: UserDto): Promise<IUsers> {
    try {
      const newUser = await this.userRepository.create({
        ...userDto,
      });
      await this.userRepository.save(newUser);
      return newUser;
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByEmail(email: string): Promise<Users> {
    try {
      const user = await this.userRepository.findOne({
        where: {
          email: email,
        },
      });
      user.password = bcrypt.hashSync(Math.random().toString(36).slice(-8), 8);

      return await this.userRepository.save(user);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async updateByPassword(token: string, password: string) {
    try {
      const email = await this.decodeConfirmationToken(token);

      const user = await this.userRepository.findOne({
        where: { email: email },
      });

      const emailVer = await this.decodeConfirmationToken(user.reset_pwd_token);

      if (emailVer) {
        user.password = bcrypt.hashSync(password, 8);
        user.reset_pwd_token = '';

        const data = await this.userRepository.save(user);

        if (typeof data === 'object' && 'email' in data) {
          return { message: 'Your password change success', status: '200' };
        } else {
          throw new BadRequestException();
        }
      } else {
        throw new BadRequestException();
      }
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  public async decodeConfirmationToken(token: string) {
    try {
      const payload = await this.jwtService.verify(token, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      });

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error) {
      if (error?.name === 'TokenExpiredError') {
        throw new BadRequestException('Email confirmation token expired');
      }
      throw new BadRequestException('Bad confirmation token');
    }
  }

  async forgotPassword(email: string) {
    const isUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (isUser) {
      const payload: JwtPayload = { email };
      const token = this.jwtService.sign(payload, {
        secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
        expiresIn: `${this.configService.get(
          'JWT_VERIFICATION_TOKEN_EXPIRATION_TIME',
        )}s`,
      });
      isUser.reset_pwd_token = token;
      await this.userRepository.save(isUser);
    }

    return {
      message: 'Forgot password link has been sent to your email!',
    };
  }
}
