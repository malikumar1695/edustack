import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsString, IsUUID, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 64)
    username!: string;

    @IsString()
    @Length(8, 128)
    password!: string;

    @IsBoolean()
    isActive!: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID("4", { each: true })
    roleIds!: string[];
}
