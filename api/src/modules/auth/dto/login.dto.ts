import { IsEmail, IsString, MinLength } from 'class-validator';
import { Prop } from '@nestjs/mongoose'
export class LoginDto {
    @Prop({
        required: true,
        unique: true,
        index: true,
        lowercase: true,
        trim: true,
    })
    @IsEmail()
    email!: string;
    @IsString()
    @MinLength(8)
    password!: string
}