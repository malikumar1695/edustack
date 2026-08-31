import { Router } from "express";
import { CreateUserDto } from "../dtos/account/CreateUserDto";
import { authenticate } from "../middlewares/authenticate.middleware";
import { requireRole } from "../middlewares/authorize.middleware";
import { validateBody } from "../middlewares/validate.middleware";
import * as userService from "../services/user.service";
import { UpdateUserDto } from "../dtos/account/UpdateUserDto";

export const userRouter = Router();

userRouter.use(authenticate, requireRole("admin"));

const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 100;

userRouter.get("/", async (req, res) => {
    const page = Math.max(1, Number(req.query.current) || 1);
    const pageSize = Math.min(
        MAX_PAGE_SIZE,
        Math.max(1, Number(req.query.pageSize) || DEFAULT_PAGE_SIZE),
    );

    res.json(await userService.listUsers(page, pageSize));
});

userRouter.post("/", validateBody(CreateUserDto), async (req, res) => {
    const { username, password, roleIds, isActive } = req.body as CreateUserDto;
    const user = await userService.createUser(username, password, roleIds, isActive!);
    req.log.info({ createdUserId: user.id, roleIds, by: req.user!.sub }, "user created by admin");
    res.status(201).json(user);
});

userRouter.put("/:id", validateBody(UpdateUserDto), async (req, res) => {
    const { roleIds, isActive } = req.body as UpdateUserDto;
    const user = await userService.updateUser(req.params.id, roleIds, isActive!, req.user!.sub);
    req.log.info({ updatedUserId: user.id, roleIds, by: req.user!.sub }, "user updated by admin");
    res.json(user);
});

userRouter.delete("/:id", async (req, res) => {
    await userService.deleteUser(req.params.id, req.user!.sub);
    req.log.info({ deletedUserId: req.params.id, by: req.user!.sub }, "user deleted by admin");
    res.status(204).send();
});


userRouter.post("/:id/unlock", async (req, res) => {
    const user = await userService.unlockUser(req.params.id);
    req.log.info({ unlockedUserId: user.id, by: req.user!.sub }, "user unlocked by admin");
    res.json(user);
});
