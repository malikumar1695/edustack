import { Transform } from "class-transformer";
import {
    IsDateString, IsEnum, IsISO31661Alpha2, IsOptional, IsPhoneNumber, IsString, Length,
} from "class-validator";
import { Gender } from "../../../prisma/generated";
import { toE164 } from "./transforms";

export class UpdateStudentDto {
    @IsString() @Length(1, 64)
    firstName!: string;

    @IsString() @Length(1, 64)
    lastName!: string;

    @IsDateString()
    dateOfBirth!: string;

    @IsEnum(Gender)
    gender!: Gender;

    @IsString() @Length(1, 128)
    guardianName!: string;

    @Transform(toE164)
    @IsPhoneNumber(undefined, { message: "guardianPhone must be a valid phone number" })
    guardianPhone!: string;

    @IsISO31661Alpha2({ message: "countryOfResidence must be a valid ISO 3166-1 alpha-2 code" })
    countryOfResidence!: string;

    @IsOptional()
    @IsString()
    userId?: string;
}
