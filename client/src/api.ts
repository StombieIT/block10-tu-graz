export enum AllowedMethod {
    GET = 'GET',
    POST = 'POST'
}

interface IRequestOptions {
    method: AllowedMethod;
}

const DEFAULT_REQUEST_OPTIONS: IRequestOptions = {
    method: AllowedMethod.GET
};

// Переменные окружения и их значения по умолчанию
const {
    VITE_API_HOST = 'localhost',
    VITE_API_PORT = 3000
} = import.meta.env;

const BASE_API_URL = `http://${VITE_API_HOST}:${VITE_API_PORT}`;

export function requestREST<T extends {}, B extends {} = {}>(
    relativeUrl: string | URL,
    options: Partial<IRequestOptions> = {},
    body?: B
): Promise<T> {
    return new Promise((resolve, reject) => {
        console.log('BASE API URL', BASE_API_URL);
        const url = new URL(relativeUrl, BASE_API_URL);
        const { method } = { ...DEFAULT_REQUEST_OPTIONS, ...options };

        const xhr = new XMLHttpRequest();

        xhr.onload = () => resolve(JSON.parse(xhr.response));
        xhr.onerror = reject;

        xhr.open(method, url);
        xhr.send(JSON.stringify(body));
    });
}
