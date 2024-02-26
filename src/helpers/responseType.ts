export interface successResponse {
    status?: number,
    body?: any,
    message?: string
}

export interface codeResponse {
    code: string
}

export interface errorResponse {
    status: number,
    message: string
}