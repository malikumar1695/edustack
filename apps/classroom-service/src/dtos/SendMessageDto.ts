import { IsString, Matches, MaxLength } from "class-validator";

export class SendMessageDto {
    @IsString()
    // At least one visible character: a blank message has nothing to keep.
    @Matches(/\S/, { message: "message can't be empty" })
    @MaxLength(2000)
    body!: string;
}
