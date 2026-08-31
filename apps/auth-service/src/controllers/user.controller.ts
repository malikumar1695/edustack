import { Router } from "express";
import { CreateUserDto } from "../dtos/account/CreateUserDto";
import { authenticate } from "../middlewares/authenticate.middleware";
import { requireRole } from "../middlewares/authorize.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import * as userService from "../services/user.service";
import { UpdateUserDto } from "../dtos/account/UpdateUserDto";

export const userRouter = Router();

userRouter.use(authenticate, requireRole("admin"));

userRouter.get("/", async (req, res) => {
    res.json(await userService.listUsers());
});

userRouter.get("/getroles", async (req, res) => {
    res.json(await userService.listRoles());
});

userRouter.post("/", validateBody(CreateUserDto), async (req, res) => {
    const { username, password, roleIds } = req.body as CreateUserDto;
    const user = await userService.createUser(username, password, roleIds);
    req.log.info({ createdUserId: user.id, roleIds, by: req.user!.sub }, "user created by admin");
    res.status(201).json(user);
});

userRouter.put("/:id", validateBody(UpdateUserDto), async (req, res) => {
    const { roleIds } = req.body as UpdateUserDto;
    const user = await userService.updateUser(req.params.id, roleIds);
    req.log.info({ updatedUserId: user.id, roleIds, by: req.user!.sub }, "user updated by admin");
    res.json(user);
});
