import { IsString, IsUUID, Length } from "class-validator";

export class UpdateClassDto {
    @IsString() @Length(1, 64)
    name!: string;

    @IsString() @Length(1, 64)
    subject!: string;

    @IsUUID(undefined, { message: "teacherUserId must be a valid user id" })
    teacherUserId!: string;

    @IsString() @Length(3, 64)
    teacherUsername!: string;

    // Enrollments are deliberately absent — they go through
    // PUT /classes/:id/students so a routine rename can't rewrite the roster.
}
