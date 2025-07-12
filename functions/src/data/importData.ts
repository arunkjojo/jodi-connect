import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";
import { transformLocationData } from "./locations";

export const importLocationData = onCall(async (request) => {
  try {
    // Only allow authenticated users to import data
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    // Optional: Add admin check
    // const adminEmails = ['admin@jodiconnect.com'];
    // if (!adminEmails.includes(request.auth.token.email)) {
    //   throw new HttpsError("permission-denied", "Only admins can import data");
    // }

    const db = getFirestore();
    const { states, districts } = transformLocationData();

    logger.info(`Starting location data import: ${states.length} states, ${districts.length} districts`);

    // Import states first
    const statesBatch = db.batch();
    let statesCount = 0;

    for (const state of states) {
      const stateRef = db.collection("states").doc();
      statesBatch.set(stateRef, {
        ...state,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      statesCount++;
    }

    await statesBatch.commit();
    logger.info(`Successfully imported ${statesCount} states`);

    // Import districts in batches (Firestore limit is 500 operations per batch)
    const batchSize = 450;
    let districtsCount = 0;
    
    for (let i = 0; i < districts.length; i += batchSize) {
      const batch = db.batch();
      const batchDistricts = districts.slice(i, i + batchSize);

      for (const district of batchDistricts) {
        const districtRef = db.collection("districts").doc();
        batch.set(districtRef, {
          ...district,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        districtsCount++;
      }

      await batch.commit();
      logger.info(`Imported batch ${Math.floor(i / batchSize) + 1}: ${batchDistricts.length} districts`);
    }

    logger.info("Location data import completed successfully");

    return {
      success: true,
      message: "Location data imported successfully",
      statesCount,
      districtsCount,
      details: {
        states: states.map(s => ({ id: s.id, name: s.name, localName: s.localName })),
        totalDistricts: districtsCount
      }
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
    
    if (!districtsSnapshot.empty) {
      // Delete districts in batches
      const batchSize = 450;
      const districtDocs = districtsSnapshot.docs;
      
      for (let i = 0; i < districtDocs.length; i += batchSize) {
        const batch = db.batch();
        const batchDocs = districtDocs.slice(i, i + batchSize);
        
        batchDocs.forEach((doc) => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
        logger.info(`Deleted districts batch ${Math.floor(i / batchSize) + 1}`);
      }
    }

    // Clear states
    const statesSnapshot = await db.collection("states").get();
    
    if (!statesSnapshot.empty) {
      const statesBatch = db.batch();
      statesSnapshot.docs.forEach((doc) => {
        statesBatch.delete(doc.ref);
      });
      await statesBatch.commit();
    }

    logger.info(`Cleared ${statesSnapshot.size} states and ${districtsSnapshot.size} districts`);

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

export const getLocationStats = onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "User must be authenticated");
    }

    const db = getFirestore();
    
    const [statesSnapshot, districtsSnapshot] = await Promise.all([
      db.collection("states").count().get(),
      db.collection("districts").count().get()
    ]);

    return {
      success: true,
      stats: {
        totalStates: statesSnapshot.data().count,
        totalDistricts: districtsSnapshot.data().count,
        lastUpdated: new Date().toISOString()
      }
    };

  } catch (error) {
    logger.error("Error getting location stats:", error);
    throw new HttpsError("internal", "Failed to get location stats");
  }
});