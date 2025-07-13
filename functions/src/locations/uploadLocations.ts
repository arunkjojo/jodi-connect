import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { db } from "../../index";
import { DocumentData } from "firebase-admin/firestore";
import { locationsData } from "./locations";

// Type Definitions
interface District {
    name: string;
    localName: string;
    available: boolean;
    link?: string;
}

interface State {
    name: string;
    localName: string;
    available: boolean;
    districts?: Record<string, District>;
}

/**
 * Uploads hierarchical state and district data from `locationsData` into Firestore.
 * Collection: 'locations' → Document: stateId → Subcollection: 'districts'
 */
export const uploadLocations = onRequest(async (req, res) => {
    try {
        const states: Record<string, State> = locationsData;

        for (const [stateId, state] of Object.entries(states)) {
            const { districts, ...stateInfo } = state;

            await db.collection("locations").doc(stateId).set(stateInfo as DocumentData);
            logger.info(`✅ State uploaded: ${stateId}`);

            if (districts) {
                const districtsRef = db.collection("locations").doc(stateId).collection("districts");

                for (const [districtId, district] of Object.entries(districts)) {
                    await districtsRef.doc(districtId).set(district as DocumentData);
                    logger.info(`   └─ District uploaded: ${districtId} under ${stateId}`);
                }
            }
        }

        logger.info("🎉 All locations uploaded successfully.");
        res.status(200).send("Locations uploaded successfully.");
    } catch (error) {
        logger.error("❌ Error uploading locations:", error);
        res.status(500).send("Error uploading locations.");
    }
});
