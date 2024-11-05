import { requestREST } from '@/api';
import { useState, type FC, type MouseEvent } from "react";

interface IQuote {
    text: string;
    author: string;
    comments: unknown[];
    reactions: unknown[];
}

export const App: FC = () => {
    const [quote, setQuote] = useState<IQuote | null>(null);

    const clickHandler = (evt: MouseEvent<HTMLButtonElement>) => {
        requestREST<IQuote>('./quotes/random/')
            .then(setQuote);
    };

    return (
        <>
            <button type="button" onClick={clickHandler}>
                Press me and check console
            </button>
            {
                quote && (
                    JSON.stringify(quote)
                )
            }
        </>
    );
};