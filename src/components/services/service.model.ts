export interface ResponseObject<T> {
    response: T | null;
    error: APICallError | null;
}

export interface APICallError {
    statusCode: number;
    URI: string;
    message: string;
    timestamp: string;
    details: string[];
}

export interface ApiMessageResponse {
    generatedId: number;
    message: string;
    timestamp: string;
}

export interface AuthRequest {
    username: string;
    password: string;
}

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
    image?: File;
}