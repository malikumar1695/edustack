import { ArrayNotEmpty, IsArray, IsBoolean, IsOptional, IsUUID } from "class-validator";

export class UpdateUserDto {

    @IsBoolean()
    isActive?: boolean;

    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(undefined, { each: true })
    roleIds!: string[];
}
