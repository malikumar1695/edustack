import { IsString, IsUUID, Length } from "class-validator";

/**
 * loginUsername is denormalised onto the Student for display, so the roster
 * can show who a record is linked to without a call to auth-service.
 */
export class LinkUserDto {
    @IsUUID(undefined, { message: "userId must be a valid user id" })
    userId!: string;

    @IsString()
    @Length(3, 64)
    loginUsername!: string;
}
