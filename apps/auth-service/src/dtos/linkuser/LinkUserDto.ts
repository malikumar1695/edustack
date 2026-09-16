import { ROLES, type RoleName } from "@ilm/auth-kit";
import { IsIn, IsString, Length, ValidateIf } from "class-validator";


export class LinkUserDto {

    @ValidateIf((o) => !o.username && !o.password)
    @IsString()
    userId?: string;

    @ValidateIf((o) => !o.userId)
    @IsString()
    @Length(3, 64)
    username!: string;

    @ValidateIf((o) => !o.userId)
    @IsString()
    @Length(8, 128)
    password!: string;

    @IsIn(ROLES as unknown as string[])
    role!: RoleName;
}