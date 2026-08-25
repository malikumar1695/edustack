import { IsIn, IsString, Length } from "class-validator";

export class CreateUserDto {
    @IsString()
    @Length(3, 64)
    username!: string;

    @IsString()
    @Length(8, 128)
    password!: string;

    @IsString()
    @IsIn(["admin", "teacher", "student", "parents"])
    roleName!: string;
}
