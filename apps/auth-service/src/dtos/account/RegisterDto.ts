import { Length } from "class-validator/types/decorator/string/Length";
import { IsString } from "class-validator/types/decorator/typechecker/IsString";


export class RegisterDto {

    @IsString()
    @Length(3, 64)
    username!: string;

    @IsString()
    @Length(8, 128)
    password!: string;
}