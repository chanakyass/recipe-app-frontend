import storage from './setup'
import { APICallError, ResponseObject } from "../storage.model";
import firebase from 'firebase';

export const deleteImageFromStorage = async (recipeImageAddress: string): Promise<ResponseObject<any>> => {
    try {
        const response = storage.refFromURL(recipeImageAddress).delete();
        return { response, error: null };
    } catch(error) {
        return { response: null, error };
    }
}

export const addImageToStorage = async (image: File, loggedInUserId: number, uniqueId: number|string, recipeImageAddress: string | undefined) => {
    let uploadTaskRef: firebase.storage.Reference;
    const format = image.name.split('.');
    if (recipeImageAddress) {
        uploadTaskRef = storage.refFromURL(recipeImageAddress);
    } else {
        uploadTaskRef = storage.ref(`images/${loggedInUserId}/${uniqueId}-image.${(format.length > 1) ? format[format.length - 1] : ''}`);
    }
    const uploadTask = uploadTaskRef.put(image as Blob);
    return new Promise<ResponseObject<string>>((resolve) => {
      uploadTask.on(
        "state_changed",
        (_) => {},
        (error) => {
          resolve({ response: null, error: error as unknown as APICallError });
        },
        () => {
            uploadTaskRef
            .getDownloadURL()
            .then((url: string) => {
              resolve({ response: url, error: null });
            })
            .catch((error) => {
                uploadTaskRef.delete();
                resolve({response: null, error: error as unknown as APICallError});
            })
        }
      );
    });
}