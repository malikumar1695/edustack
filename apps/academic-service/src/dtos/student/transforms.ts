import { CountryCode, parsePhoneNumberFromString } from "libphonenumber-js";

/** Fallback region for numbers typed without a country code (0332-5365478). */
export const DEFAULT_PHONE_REGION: CountryCode = "PK";

/**
 * Normalises any accepted phone format to E.164 before validation runs.
 * Unparseable input is passed through untouched so @IsPhoneNumber reports it
 * rather than the transform silently swallowing a bad value.
 */
export const toE164 = ({ value }: { value: unknown }) => {
    if (typeof value !== "string") return value;

    const parsed = parsePhoneNumberFromString(value.trim(), DEFAULT_PHONE_REGION);
    return parsed?.isValid() ? parsed.number : value;
};
