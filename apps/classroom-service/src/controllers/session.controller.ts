import { requireRole } from "@ilm/auth-kit";
import { validateBody } from "@ilm/http-kit";
import { Router } from "express";
import { SendMessageDto } from "../dtos/SendMessageDto";
import { StartSessionDto } from "../dtos/StartSessionDto";
import * as sessionService from "../services/session.service";

export const sessionRouter = Router();

sessionRouter.post("/", requireRole("admin", "teacher"), validateBody(StartSessionDto), async (req, res) => {
    const { classId } = req.body as StartSessionDto;

    // authenticate has already verified this header, so it's present.
    const session = await sessionService.startSession(
        classId, req.user!, req.headers.authorization!, req.id ? String(req.id) : undefined,
    );
    res.status(201).json(session);
});

// Before "/:id" routes so "live" isn't matched as an id.
sessionRouter.get("/live", async (req, res) => {
    res.json(await sessionService.listLiveSessions(req.user!));
});

// POST, not GET: it mints a credential, and GET responses get cached and
// logged in places a credential shouldn't be.
sessionRouter.post("/:id/token", async (req, res) => {
    const result = await sessionService.getJoinToken(req.params.id, req.user!);
    req.log.info({ sessionId: req.params.id, role: result.role, by: req.user!.sub }, "join token issued");
    res.json(result);
});

sessionRouter.get("/:id/messages", async (req, res) => {
    res.json(await sessionService.listMessages(req.params.id, req.user!));
});

sessionRouter.post("/:id/messages", validateBody(SendMessageDto), async (req, res) => {
    const { body } = req.body as SendMessageDto;

    const message = await sessionService.sendMessage(req.params.id, body, req.user!);
    // Never the body: what children write in class doesn't belong in the logs.
    req.log.info({ sessionId: req.params.id, messageId: message.id, by: req.user!.sub }, "chat message sent");
    res.status(201).json(message);
});

sessionRouter.post("/:id/end", requireRole("admin", "teacher"), async (req, res) => {
    await sessionService.endSession(req.params.id, req.user!);
    res.status(204).send();
});
