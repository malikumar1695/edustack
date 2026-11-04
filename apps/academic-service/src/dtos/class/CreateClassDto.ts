import { IsString, IsUUID, Length } from "class-validator";

export class CreateClassDto {
    @IsString()
    @Length(1, 64)
    name!: string;

    @IsString()
    @Length(1, 64)
    subject!: string;

    /// A User in auth-service holding the teacher role. There is no foreign
    /// key to check it against — the admin picks it from auth-service's list.
    @IsUUID(undefined, { message: "teacherUserId must be a valid user id" })
    teacherUserId!: string;

    /// Denormalised for display, same as LinkUserDto.loginUsername.
    @IsString()
    @Length(3, 64)
    teacherUsername!: string;
}
