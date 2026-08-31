import { Router } from "express";
import { authenticate } from "../middlewares/authenticate.middleware";
import { requireRole } from "../middlewares/authorize.middleware";
import * as userService from "../services/user.service";

export const roleRouter = Router();

roleRouter.use(authenticate, requireRole("admin"));

roleRouter.get("/", async (_req, res) => {
    res.json(await userService.listRoles());
});
