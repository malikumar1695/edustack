import { describe, expect, it } from "vitest"
import { signAccessToken, verifyAccessToken } from "./jwt";



describe("access token", () => {
    it("signs and verifies an access token", () => {
        const token = signAccessToken({ sub: "user-1", username: "admin", roles: ["admin"] })
        const claims = verifyAccessToken(token);

        expect(claims.sub).toBe("user-1");
        expect(claims.username).toBe("admin");
        expect(claims.roles).toEqual(["admin"]);
    });

    it("rejects a tempered token", () => {
        const token = signAccessToken({ sub: "user-1", username: "admin", roles: ["admin"] })
        const temperedToken = token.slice(0, -2) + "xx"; // tamper the token by changing the last two characters

        expect(() => verifyAccessToken(temperedToken)).toThrow();
    });
});