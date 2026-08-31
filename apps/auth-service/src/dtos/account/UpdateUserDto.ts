import { ArrayNotEmpty, IsArray, IsUUID } from "class-validator";

export class UpdateUserDto {
    @IsArray()
    @ArrayNotEmpty()
    @IsUUID(undefined, { each: true })
    roleIds!: string[];
}
