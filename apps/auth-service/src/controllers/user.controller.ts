import { Router } from "express";
import { CreateUserDto } from "../dtos/account/CreateUserDto";
import { authenticate } from "../middlewares/authenticate.middleware";
import { requireRole } from "../middlewares/authorize.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import * as userService from "../services/user.service";

export const userRouter = Router();

userRouter.use(authenticate, requireRole("admin"));

userRouter.get("/", async (req, res) => {
    res.json(await userService.listUsers());
});

userRouter.post("/", validateBody(CreateUserDto), async (req, res) => {
    const { username, password, roleName } = req.body as CreateUserDto;
    const user = await userService.createUser(username, password, roleName);
    req.log.info({ createdUserId: user.id, roleName, by: req.user!.sub }, "user created by admin");
    res.status(201).json(user);
});
