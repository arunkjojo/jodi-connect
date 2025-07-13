import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import { phoneLogin } from "./src/auth/phoneLogin";
import { checkUserStatus } from "./src/user/checkUserStatus";
import { sendNotification } from "./src/notifications/sendNotification";
import { uploadLocations } from "./src/locations/uploadLocations";

initializeApp();
setGlobalOptions({ maxInstances: 10 });

export const db = getFirestore();

export const helloWorld = onRequest((request, response) => {
    logger.info("Hello logs!", { structuredData: true });
    response.send("Hello from Firebase!");
});

export { phoneLogin, checkUserStatus, sendNotification, uploadLocations };