import { getFirestore } from "firebase-admin/firestore";
import * as logger from "firebase-functions/logger";

export class DataImportHelper {
  private db = getFirestore();

  /**
   * Import data in batches to handle large datasets
   */
  async importInBatches<T>(
    collectionName: string,
    data: T[],
    batchSize: number = 450,
    transformFn?: (item: T) => any
  ): Promise<void> {
    const batches: any[][] = [];
    
    // Split data into batches
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }

    logger.info(`Importing ${data.length} items in ${batches.length} batches`);

    for (let i = 0; i < batches.length; i++) {
      const batch = this.db.batch();
      const batchData = batches[i];

      for (const item of batchData) {
        const docRef = this.db.collection(collectionName).doc();
        const docData = transformFn ? transformFn(item) : item;
        
        batch.set(docRef, {
          ...docData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      await batch.commit();
      logger.info(`Committed batch ${i + 1}/${batches.length} with ${batchData.length} items`);
    }
  }

  /**
   * Clear all documents from a collection
   */
  async clearCollection(collectionName: string): Promise<number> {
    const snapshot = await this.db.collection(collectionName).get();
    
    if (snapshot.empty) {
      return 0;
    }

    const batch = this.db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    logger.info(`Cleared ${snapshot.size} documents from ${collectionName}`);
    
    return snapshot.size;
  }

  /**
   * Check if collection exists and has data
   */
  async collectionExists(collectionName: string): Promise<boolean> {
    const snapshot = await this.db.collection(collectionName).limit(1).get();
    return !snapshot.empty;
  }

  /**
   * Get collection document count
   */
  async getCollectionCount(collectionName: string): Promise<number> {
    const snapshot = await this.db.collection(collectionName).count().get();
    return snapshot.data().count;
  }
}