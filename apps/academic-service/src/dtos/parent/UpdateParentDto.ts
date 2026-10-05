import { Transform } from "class-transformer";
import {
    IsEmail, IsEnum, IsISO31661Alpha2, IsOptional, IsPhoneNumber, IsString, Length,
} from "class-validator";
import { Gender } from "../../../prisma/generated";
import { toE164 } from "../../lib/transforms";

export class UpdateParentDto {
    @IsString() @Length(1, 64)
    firstName!: string;

    @IsString() @Length(1, 64)
    lastName!: string;

    @IsEnum(Gender)
    gender!: Gender;

    @IsOptional()
    @IsEmail({}, { message: "email must be a valid email address" })
    @Length(1, 128)
    email?: string;

    @Transform(toE164)
    @IsPhoneNumber(undefined, { message: "phone must be a valid phone number" })
    phone!: string;

    @IsISO31661Alpha2({ message: "countryOfResidence must be a valid ISO 3166-1 alpha-2 code" })
    countryOfResidence!: string;

    // userId is deliberately absent — see CreateParentDto.
}
