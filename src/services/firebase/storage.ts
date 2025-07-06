import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from './config';

interface UploadMetadata {
    contentType: string;
    customMetadata?: {
        uploadedBy: string;
        uploadTime: string;
        fileType: string;
        originalName: string;
    };
}

export class FirebaseStorageService {
    /**
     * Upload profile picture to Firebase Storage
     */
    static async uploadProfilePicture(
        userId: string,
        file: File,
        index: number = 0
    ): Promise<string> {
        try {
            const fileName = `profile_${index}_${Date.now()}.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, `users/${userId}/profile-pictures/${fileName}`);

            const metadata: UploadMetadata = {
                contentType: file.type,
                customMetadata: {
                    uploadedBy: userId,
                    uploadTime: new Date().toISOString(),
                    fileType: 'profile-picture',
                    originalName: file.name,
                },
            };

            const snapshot = await uploadBytes(storageRef, file, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading profile picture:', error);
            throw new Error('Failed to upload profile picture');
        }
    }

    /**
     * Upload ID verification document
     */
    static async uploadIdDocument(
        userId: string,
        file: File,
        documentType: 'aadhaar' | 'pan' | 'passport' | 'driving_license'
    ): Promise<string> {
        try {
            const fileName = `${documentType}_${Date.now()}.${file.name.split('.').pop()}`;
            const storageRef = ref(storage, `users/${userId}/id-documents/${fileName}`);

            const metadata: UploadMetadata = {
                contentType: file.type,
                customMetadata: {
                    uploadedBy: userId,
                    uploadTime: new Date().toISOString(),
                    fileType: 'id-document',
                    documentType,
                    originalName: file.name,
                },
            };

            const snapshot = await uploadBytes(storageRef, file, metadata);
            const downloadURL = await getDownloadURL(snapshot.ref);

            return downloadURL;
        } catch (error) {
            console.error('Error uploading ID document:', error);
            throw new Error('Failed to upload ID document');
        }
    }

    /**
     * Get all profile pictures for a user
     */
    static async getUserProfilePictures(userId: string): Promise<string[]> {
        try {
            const profilePicturesRef = ref(storage, `users/${userId}/profile-pictures`);
            const result = await listAll(profilePicturesRef);

            const urls = await Promise.all(
                result.items.map(item => getDownloadURL(item))
            );

            return urls;
        } catch (error) {
            console.error('Error fetching profile pictures:', error);
            return [];
        }
    }

    /**
     * Delete a file from storage
     */
    static async deleteFile(filePath: string): Promise<void> {
        try {
            const fileRef = ref(storage, filePath);
            await deleteObject(fileRef);
        } catch (error) {
            console.error('Error deleting file:', error);
            throw new Error('Failed to delete file');
        }
    }

    /**
     * Upload multiple files with progress tracking
     */
    static async uploadMultipleFiles(
        userId: string,
        files: File[],
        onProgress?: (progress: number) => void
    ): Promise<string[]> {
        const uploadPromises = files.map(async (file, index) => {
            const url = await this.uploadProfilePicture(userId, file, index);
            if (onProgress) {
                onProgress(((index + 1) / files.length) * 100);
            }
            return url;
        });

        return Promise.all(uploadPromises);
    }
}