import { firebaseStorage } from "./firebase";

export const deleteImageFromStorage = async (recipeImageAddress: string) => {
    return firebaseStorage.deleteImageFromStorage(recipeImageAddress);
}

export const addImageToStorage = async (image: File, loggedInUserId: number, uniqueId: number|string, recipeImageAddress: string | undefined) => {
    return firebaseStorage.addImageToStorage(image, loggedInUserId, uniqueId, recipeImageAddress);
}