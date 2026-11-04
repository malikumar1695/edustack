import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "../.env.test") });

// Not .env: that would point the integration suite at the dev database. The
// unit tests only need the local keypair.
process.env.JWT_PRIVATE_KEY_PATH ??= resolve(__dirname, "../keys/private.pem");
process.env.JWT_PUBLIC_KEY_PATH ??= resolve(__dirname, "../keys/public.pem");
process.env.LOG_LEVEL ??= "silent";