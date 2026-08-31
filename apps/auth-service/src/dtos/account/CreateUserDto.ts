import { ArrayNotEmpty, IsArray, IsIn, IsString, IsUUID, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 64)
    username!: string;

    @IsString()
    @Length(8, 128)
    password!: string;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    roleIds!: string[];
}
