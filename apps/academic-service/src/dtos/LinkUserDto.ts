import { IsString, IsUUID, Length } from "class-validator";

/**
 * Shared by students and parents: both link to a User in auth-service.
 *
 * loginUsername is denormalised onto the record for display, so a roster can
 * show who it is linked to without a call to auth-service.
 */
export class LinkUserDto {
    @IsUUID(undefined, { message: "userId must be a valid user id" })
    userId!: string;

    @IsString()
    @Length(3, 64)
    loginUsername!: string;
}
