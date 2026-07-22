import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config'
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt'
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService
    ) { }
    async register(dto: RegisterDto) {
        const existingUser = await this.userModel.findOne({
            email: dto.email
        }).lean();
        if (existingUser) {
            throw new ConflictException('Email already exists');
        }
        const saltRounds = Number(this.configService.get('BCRYPT_SALT_ROUNDS') ?? 12);
        const passwordHash = await bcrypt.hash(dto.password, saltRounds);
        const user = await this.userModel.create({
            email: dto.email,
            passwordHash
        }
        )
        return {
            id: user.id,
            email: user.email,
            role: user.role,
        };
    };
    async login(dto: LoginDto) {
        const user = await this.userModel.findOne({
            email: dto.email,
        })
        if (!user) {
            throw new UnauthorizedException("Invalid email or password");
        }
        const isPasswordValid = await bcrypt.compare(
            dto.password,
            user.passwordHash
        )
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password')
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        const accessToken = await this.jwtService.signAsync(payload);
        return{
            AccessToken:accessToken,
            user:{
                id:user.id,
                email:user.email,
                role:user.role
            }
        }
    }
}
