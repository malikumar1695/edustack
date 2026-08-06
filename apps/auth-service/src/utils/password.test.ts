import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword } from "./password";


describe("password hashing", () => {
    it("hashes a password and can verify it against the same password", async () => {
        const hash = await hashPassword("correct-password-to-check");
        expect(hash).not.toEqual("correct-password-to-check");
        await expect(verifyPassword(hash, "correct-password-to-check")).resolves.toBe(true);
    });

    it("fails verification against the wrong password", async () => {
        const hash = await hashPassword("correct-password-to-check");
        await expect(verifyPassword(hash, "wrong-password")).resolves.toBe(false);
    });
});