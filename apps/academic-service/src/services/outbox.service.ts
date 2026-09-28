import { logger } from "@ilm/http-kit";
import { publishEvent } from "../lib/events";
import * as outboxRepo from "../repositories/outbox.repository";
import cron from "node-cron";


const BATCH_SIZE = 20;

export const relayOutbox = async (): Promise<void> => {
    const events = await outboxRepo.findUnpublished(BATCH_SIZE);

    for (const event of events) {
        try {
            await publishEvent(event.type, {
                eventId: event.id,
                type: event.type,
                occurredAt: event.occurredAt.toISOString(),
                data: event.payload,
            });
            await outboxRepo.markPublished(event.id);
        } catch (error) {
            logger.error({ err: error, eventId: event.id, type: event.type }, "outbox relay failed");
        }
    }
};

let running = false;

const relayTick = async (): Promise<void> => {
    if (running) return;

    running = true;
    try {
        await relayOutbox();
    } catch (error) {
        logger.error({ err: error }, "outbox relay tick failed");
    } finally {
        running = false;
    }
};

export const relayOutboxInBackground = (): void => {
    void relayTick();
};

// Six fields — the leading one is seconds. "off" disables the sweeper, which
// is what you want locally if you don't want dev keeping Neon awake all day.
const RELAY_SCHEDULE = process.env.OUTBOX_RELAY_SCHEDULE ?? "*/30 * * * * *";

export const startOutboxRelay = (): void => {
    if (RELAY_SCHEDULE === "off") {
        logger.info("outbox relay sweeper disabled");
        return;
    }

    // A typo'd expression would otherwise leave the sweeper silently never
    // running — fail at boot instead, where it's obvious.
    if (!cron.validate(RELAY_SCHEDULE)) {
        throw new Error(`Invalid OUTBOX_RELAY_SCHEDULE: "${RELAY_SCHEDULE}"`);
    }

    cron.schedule(RELAY_SCHEDULE, relayTick);
    logger.info({ schedule: RELAY_SCHEDULE }, "outbox relay sweeper scheduled");
};

