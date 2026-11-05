import { IsUUID } from "class-validator";

export class StartSessionDto {
    @IsUUID(undefined, { message: "classId must be a valid class id" })
    classId!: string;
}
