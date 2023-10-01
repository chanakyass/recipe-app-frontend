
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import store from "./setup";

export interface UserProxy {
    id: number;
    email: string;
    profileName: string;
}

export interface User {
    id?: number;
    firstName: string;
    middleName: string;
    lastName: string;
    profileName: string;
    userSummary: string;
    dob: string;
    email: string;
    password?: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

export interface Ingredient {
    id?: number;
    name: string;
    description?: string;
}

export interface RecipeIngredient {
    id?: number;
    ingredient: Ingredient;
    quantity?: number;
    uom?: string;
    uuid?: string;
}

export interface Recipe {
    id?: number;
    name: string;
    description: string;
    createdOn: string;
    itemType: string;
    serving: number | string;
    recipeImageAddress: string;
    cookingInstructions: string;
    recipeIngredients: RecipeIngredient[];
    user: UserProxy;
}

export interface Resource {
    id: number;
    [key: string]: any;
}

export interface APICallError {
    statusCode: number;
    URI: string;
    message: string;
    timestamp: string;
    details: string[];
}

export interface Notification {
    resourceId?: number;
    resourceType?: string;
    error?: APICallError;
    action?: string;
    id: string;
    message?: string;
    errorType?: string;
};

export interface ResourceState<T> {
    resourceMap: { [key: number]: T };
    loading: boolean;
}

export interface NotificationState {
    errors: Notification[];
    notifications: Notification[];
    errorInView: boolean;
    notificationInView: boolean;
    currentNotificationMessage: string;
    triggerNotification: boolean;
}

export interface UserState {
    loggedInUser: User;
    loading: boolean;
}

export type MainStoreStateType = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch;

export type DispatchAppFunc = () => AppDispatch;

export type ResourcePayloadType<T> = { payload: T, type: string}

export const useAppDispatch: DispatchAppFunc = useDispatch

export const useRecipeSelector: TypedUseSelectorHook<{ recipes: ResourceState<Recipe> }> = useSelector;

export const useErrorSelector: TypedUseSelectorHook<{ notifications: NotificationState }> = useSelector;

export const useUserSelector: TypedUseSelectorHook<{ users: UserState }> = useSelector;

export enum ThunkResponse {
    SUCCESS, FAILURE
};