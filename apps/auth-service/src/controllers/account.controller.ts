import "dotenv/config";
import { Router } from "express";
import { LoginDto } from "../dtos/account/LoginDto";
import { loginRateLimiter, registerRateLimiter } from "../middlewares/rate-limit.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import * as authService from "../services/auth.service";
import { UsernameTakenError } from "../services/auth.service";
import { RefreshTokenMissingError } from "../errors/AppError";
import { RegisterDto } from "../dtos/account/RegisterDto";

export const accountRouter = Router();

const REFRESH_COOKIE = "refreshToken";
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/auth"
}

accountRouter.post("/login", loginRateLimiter, validateBody(LoginDto), async (req, res) => {
    const { username, password } = req.body as LoginDto;
    const { accessToken, refreshToken } = await authService.login(username, password);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    req.log.info({ username }, "user logged in");
    res.json({ accessToken });
});

accountRouter.post("/register", registerRateLimiter, validateBody(RegisterDto), async (req, res) => {

    const { username, password } = req.body as RegisterDto;
    const { accessToken, refreshToken } = await authService.register(username, password);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    req.log.info({ username }, "user registered");
    res.status(201).json({ accessToken });

});
accountRouter.post("/refresh", async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) {
        throw new RefreshTokenMissingError();
    }

    const { accessToken, refreshToken } = await authService.refresh(token);
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions);
    req.log.info("token refreshed");
    res.json({ accessToken });

});

accountRouter.post("/logout", async (req, res) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) {
        await authService.logout(token);
        res.clearCookie(REFRESH_COOKIE, cookieOptions);
        req.log.info("user logged out");
    }
    res.status(204).send();
});