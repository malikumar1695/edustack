import { getCountries } from "libphonenumber-js";

const GENDER_OPTIONS = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
];

const REGION_NAMES = new Intl.DisplayNames(['en'], { type: 'region' });

const COUNTRY_OPTIONS = getCountries().map(code => {
    return {
        label: REGION_NAMES.of(code),
        value: code,
    };
});

export { GENDER_OPTIONS, COUNTRY_OPTIONS };