import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

// Import your location data - you'll need to create this file
import { locationData } from "./locations";

interface LocationData {
  states: Array<{
    id: number;
    name: string;
    localName: string;
    available: boolean;
    districts: Array<{
      id: number;
      name: string;
      localName: string;
      available: boolean;
    }>;
  }>;
}

export const importLocationData = onCall(async (request) => {
  try {
    // Only allow authenticated admin users to import data
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Add additional admin check if needed
    // const adminEmails = ['admin@jodiconnect.com'];
    // if (!adminEmails.includes(request.auth.token.email)) {
    //   throw new HttpsError("permission-denied", "Only admins can import data");
    // }

    const db = getFirestore();
    const batch = db.batch();
    let operationCount = 0;

    logger.info("Starting location data import...");

    // Import states
    for (const state of locationData.states) {
      const stateRef = db.collection("states").doc();
      batch.set(stateRef, {
        id: state.id,
        name: state.name,
        localName: state.localName,
        available: state.available,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      operationCount++;

      // Import districts for this state
      for (const district of state.districts) {
        const districtRef = db.collection("districts").doc();
        batch.set(districtRef, {
          id: district.id,
          name: district.name,
          localName: district.localName,
          available: district.available,
          stateId: state.id,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        operationCount++;

        // Firestore batch limit is 500 operations
        if (operationCount >= 450) {
          await batch.commit();
          logger.info(`Committed batch with ${operationCount} operations`);
          operationCount = 0;
        }
      }
    }

    // Commit remaining operations
    if (operationCount > 0) {
      await batch.commit();
      logger.info(`Committed final batch with ${operationCount} operations`);
    }

    logger.info("Location data import completed successfully");

    return {
      success: true,
      message: "Location data imported successfully",
      statesCount: locationData.states.length,
      districtsCount: locationData.states.reduce((total, state) => total + state.districts.length, 0),
    };

  } catch (error) {
    logger.error("Error importing location data:", error);
    throw new HttpsError("internal", "Failed to import location data");
  }
});

export const clearLocationData = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const db = getFirestore();
    
    // Clear districts first (due to potential foreign key relationships)
    const districtsSnapshot = await db.collection("districts").get();
    const districtsBatch = db.batch();
    
    districtsSnapshot.docs.forEach((doc) => {
      districtsBatch.delete(doc.ref);
    });
    
    if (!districtsSnapshot.empty) {
      await districtsBatch.commit();
      logger.info(`Deleted ${districtsSnapshot.size} districts`);
    }

    // Clear states
    const statesSnapshot = await db.collection("states").get();
    const statesBatch = db.batch();
    
    statesSnapshot.docs.forEach((doc) => {
      statesBatch.delete(doc.ref);
    });
    
    if (!statesSnapshot.empty) {
      await statesBatch.commit();
      logger.info(`Deleted ${statesSnapshot.size} states`);
    }

    return {
      success: true,
      message: "Location data cleared successfully",
      deletedStates: statesSnapshot.size,
      deletedDistricts: districtsSnapshot.size,
    };

  } catch (error) {
    logger.error("Error clearing location data:", error);
    throw new HttpsError("internal", "Failed to clear location data");
  }
});