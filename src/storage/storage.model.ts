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