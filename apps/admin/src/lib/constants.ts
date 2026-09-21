import { getCountries } from "libphonenumber-js";

const GENDER_OPTIONS = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
];

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

const ROLES = ["admin", "teacher", "student", "parents"] as const;
type RoleName = (typeof ROLES)[number];


const COUNTRY_OPTIONS = getCountries().map(code => {
    return {
        label: REGION_NAMES.of(code),
        value: code,
    };
});

const getCountry = (code: string) => REGION_NAMES.of(code);

export { GENDER_OPTIONS, COUNTRY_OPTIONS, getCountry, ROLES, type RoleName };