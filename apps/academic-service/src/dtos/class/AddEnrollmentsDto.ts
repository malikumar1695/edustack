import { ArrayMaxSize, ArrayNotEmpty, ArrayUnique, IsArray, IsUUID } from "class-validator";

/** Only the students being added. Anyone already enrolled is left as they are. */
export class AddEnrollmentsDto {
    @IsArray()
    @ArrayNotEmpty()
    @ArrayUnique()
    @ArrayMaxSize(200)
    @IsUUID(undefined, { each: true, message: "each studentId must be a valid id" })
    studentIds!: string[];
}
