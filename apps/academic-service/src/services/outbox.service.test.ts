import { beforeEach, describe, expect, it, vi } from "vitest";
import { OutboxEvent } from "../../prisma/generated";
import * as outboxRepo from "../repositories/outbox.repository";
import { relayOutbox } from "./outbox.service";
import { publishEvent } from "../lib/events";

vi.mock("../lib/prisma", () => ({ prisma: {} }));
vi.mock("../repositories/outbox.repository");
vi.mock("../lib/events", () => ({ publishEvent: vi.fn() }));

const makeEvent = (overrides: Partial<OutboxEvent> = {}): OutboxEvent => ({
    id: "e1",
    type: "student.created",
    payload: { studentId: "s1" },
    occurredAt: new Date("2026-09-27T10:00:00.000Z"),
    publishedAt: null,
    ...overrides,
});

describe("outbox.service", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should relay outbox events", async () => {
        vi.mocked(outboxRepo.findUnpublished).mockResolvedValue([makeEvent()]);

        await relayOutbox();

        expect(publishEvent).toHaveBeenCalledWith("student.created", {
            eventId: "e1",
            type: "student.created",
            occurredAt: new Date("2026-09-27T10:00:00.000Z").toISOString(),
            data: { studentId: "s1" },
        });

        expect(outboxRepo.markPublished).toHaveBeenCalledWith("e1");
    });

    it("leaves the row unpublished when the publish fails", async () => {
        vi.mocked(outboxRepo.findUnpublished).mockResolvedValue([makeEvent()]);
        vi.mocked(publishEvent).mockRejectedValue(new Error("Failed to publish"));

        await expect(relayOutbox()).resolves.toBeDefined();
        expect(outboxRepo.markPublished).not.toHaveBeenCalled();
    });

    it("keeps relaying the rest of the batch after one failure", async () => {
        vi.mocked(outboxRepo.findUnpublished).mockResolvedValue([
            makeEvent({ id: "e1" }),
            makeEvent({ id: "e2" }),
        ]);
        vi.mocked(publishEvent)
            .mockRejectedValueOnce(new Error("SNS unreachable"))
            .mockResolvedValueOnce(undefined);

        await relayOutbox();

        expect(publishEvent).toHaveBeenCalledTimes(2);
        expect(outboxRepo.markPublished).toHaveBeenCalledTimes(1);
        expect(outboxRepo.markPublished).toHaveBeenCalledWith("e2");
    });
});
