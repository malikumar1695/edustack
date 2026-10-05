import { Transform } from "class-transformer";
import {
    IsEmail, IsEnum, IsISO31661Alpha2, IsOptional, IsPhoneNumber, IsString, Length
} from "class-validator";
import { Gender } from "../../../prisma/generated";
import { toE164 } from "../../lib/transforms";

export class CreateParentDto {
    @IsString()
    @Length(1, 64)
    firstName!: string;

    @IsString()
    @Length(1, 64)
    lastName!: string;

    /// Optional to match the schema — not every guardian has one — but it is
    /// where notifications will be sent, so it must be a real address.
    @IsOptional()
    @IsEmail({}, { message: "email must be a valid email address" })
    @Length(1, 128)
    email?: string;

    @IsEnum(Gender)
    gender!: Gender;

    @Transform(toE164)
    @IsPhoneNumber(undefined, { message: "phone must be a valid phone number" })
    phone!: string;

    @IsISO31661Alpha2({ message: "countryOfResidence must be a valid ISO 3166-1 alpha-2 code" })
    countryOfResidence!: string;

    // phoneCountry is deliberately absent — derived from phone on write.
    // userId is deliberately absent — linking an account goes through
    // PUT /parents/:id/user so a routine edit can't rewrite it.
}

