import { BadRequestException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { AuthTokenPayload } from './token.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password, fullname } = signUpDto;

    const emailExists = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: hashedPassword,
        fullname,
      },
    });

    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      iat: 0,
      exp: 0,
      role: '',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        algorithm: 'HS256',
      }),
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const payload: AuthTokenPayload = {
      sub: user.id,
      email: user.email,
      iat: 0,
      exp: 0,
      role: '',
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        algorithm: 'HS256',
      }),
    };
  }
}
