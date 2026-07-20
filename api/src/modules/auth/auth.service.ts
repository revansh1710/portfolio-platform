import { Injectable,ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User,UserDocument } from './schemas/user.schema'
import { Model } from 'mongoose';
import {RegisterDto} from './dto/register.dto';
@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name)
        private readonly userModel: Model<UserDocument>,
    ) { }
    async register(dto: RegisterDto) {
        const existingUser=await this.userModel.findOne({
            email:dto.email
        })
        if(existingUser){
            throw new ConflictException('Email already exists');
        }

        return{
            message:'Email is available'
        }
    }
}
