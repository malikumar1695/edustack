import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

// One topic per event type. A new event type means one row here and nothing
// else — publishers never learn who subscribes.
const topicArnByType: Record<string, string | undefined> = {
    "student.created": process.env.SNS_STUDENT_CREATED_ARN,
};


export class UnroutableEventError extends Error {
    constructor(type: string) {
        super(`No SNS topic configured for event type "${type}"`);
        this.name = "UnroutableEventError";
    }
}

export const publishEvent = async (type: string, message: unknown): Promise<void> => {
    const topicArn = topicArnByType[type];
    // Throws rather than warn-and-return: a silent no-op would let the relay
    // mark the row published when nothing was ever sent.
    if (!topicArn) throw new UnroutableEventError(type);

    await snsClient.send(new PublishCommand({ TopicArn: topicArn, Message: JSON.stringify(message) }));
};