-- AlterTable
ALTER TABLE "SessionMember" ALTER COLUMN "role" TYPE "ParticipantRole" USING ("role"::text::"ParticipantRole");

-- DropEnum
DROP TYPE "MemberRole";
