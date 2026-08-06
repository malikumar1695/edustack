import { IsIn, IsString, Length, Matches } from "class-validator";

export class LoginDto {
    @IsString()
    @Length(3, 64)
    username!: string;

    @IsString()
    @Length(5, 128)
    password!: string;

    
}