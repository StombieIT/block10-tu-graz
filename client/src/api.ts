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
        const url = new URL(relativeUrl, BASE_API_URL);
        const { method } = { ...DEFAULT_REQUEST_OPTIONS, ...options };

        const xhr = new XMLHttpRequest();

        xhr.onload = () => {
            const response = JSON.parse(xhr.response);
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(response);
            } else {
                reject(response);
            }
        }
        xhr.onerror = reject;

        xhr.open(method, url);
        xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
        xhr.send(JSON.stringify(body));
    });
}

export type Id = string;

export interface IQuote {
    id: Id; // Уникальный идентификатор цитаты
    text: string; // Текст цитаты
    author: string; // Автор цитаты
    comments: IComment[]; // Массив идентификаторов комментариев
    reactions: IReaction[]; // Массив идентификаторов реакций
}

export interface IComment {
    id: Id; // Уникальный идентификатор комментария
    text: string; // Текст комментария
    author: string; // Автор комментария
    quote: string | null; // Идентификатор цитаты, к которой относится комментарий
    parentComment: string | null; // Идентификатор родительского комментария, если это вложенный комментарий
    createdAt: string; // Дата создания комментария
}

export enum ReactionType {
    LIKE = 'like',
    DISLIKE = 'dislike',
    LOVE = 'love',
    ANGRY = 'angry',
    HAPPY = 'happy'
}

export interface IReaction {
    id: Id; // Уникальный идентификатор реакции
    type: ReactionType; // Тип реакции
    quote: string; // Идентификатор цитаты, к которой относится реакция
    createdAt: string; // Дата создания реакции
}


