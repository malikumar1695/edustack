import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";
import { logger } from "@ilm/http-kit";


const topicArn = process.env.SNS_STUDENT_CREATED_ARN;

const snsClient = new SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
});

export type StudentCreatedEvent = {
    eventId: string;
    type: "student.created";
    occurredAt: string;
    data: {
        studentId: string;
        admissionNo: string;
        firstName: string;
        lastName: string;
    }
};

export const publishStudentCreated = async (event: StudentCreatedEvent): Promise<void> => {
    if (!topicArn) {
        logger.warn("SNS_STUDENT_CREATED_ARN is not defined");
        return;
    }

    await snsClient.send(new PublishCommand({
        TopicArn: topicArn,
        Message: JSON.stringify(event)
    }));
};