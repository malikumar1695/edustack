import { ArrayMaxSize, ArrayUnique, IsArray, IsUUID } from "class-validator";

/**
 * The complete roster, not a diff: the client sends every student who should
 * be enrolled and the server makes it so. Replaying the same request is
 * harmless, which a pair of add/remove calls can't promise.
 */
export class SetEnrollmentsDto {
    @IsArray()
    @ArrayUnique()
    @ArrayMaxSize(200)
    @IsUUID(undefined, { each: true, message: "each studentId must be a valid id" })
    studentIds!: string[];
}
