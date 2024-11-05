import { useEffect, useState } from 'react';
import { AllowedMethod, IComment, Id, IQuote, IReaction, ReactionType, requestREST } from '@/api';
import { Column, CommentsList, Container, Form, RandomQuote, ReactionsList } from '@/components';

export const App = () => {
    const [randomQuote, setRandomQuote] = useState<IQuote | null>(null);
    const [comments, setComments] = useState<IComment[]>([]);
    const [reactions, setReactions] = useState<IReaction[]>([]);

    useEffect(() => {
        async function fetchRandomQuote() {
            const quote = await requestREST<IQuote>('/quotes/random');
            setRandomQuote(quote);
            setComments(quote.comments);
            setReactions(quote.reactions);
        }

        fetchRandomQuote();
    }, []);

    const addQuote = async ({ text, author }: Pick<IQuote, 'text' | 'author'>) => {
        const newQuote = await requestREST<IQuote>('/quotes/add', { method: AllowedMethod.POST }, {
            text,
            author: author ?? 'Anonymous'
        });
        setRandomQuote(newQuote);
        setComments(newQuote.comments);
        setReactions(newQuote.reactions);
    };

    const addComment = async ({ text, author }: Pick<IComment, 'text' | 'author'>, quoteId: Id) => {
        const newComment = await requestREST<IComment>('/comments/add', { method: AllowedMethod.POST }, { text, author, quoteId });
        setComments((prev) => [...prev, newComment]);
    };

    const addReaction = async (type: ReactionType) => {
        if (randomQuote) {
            const newReaction = await requestREST<IReaction>(`/reactions/add-to-quote/${randomQuote.id}`, { method: AllowedMethod.POST }, { type });
            setReactions((prev) => [...prev, newReaction]);
        }
    };

    return (
        <Container>
            <Column>
                <RandomQuote quote={randomQuote} />
                <Form onSubmit={addQuote} buttonText="Add Quote" />
            </Column>
            <Column>
                <CommentsList comments={comments} />
                <Form onSubmit={payload => randomQuote && addComment(payload, randomQuote.id)} buttonText="Add Comment" />
                <ReactionsList reactions={reactions} onAddReaction={addReaction} />
            </Column>
        </Container>
    );
};