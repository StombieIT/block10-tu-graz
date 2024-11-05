import { ChangeEvent, FC, useState } from 'react';
import styled from 'styled-components';
import { IQuote, IComment, IReaction, ReactionType } from './api';

export const Container = styled.div`
    display: flex;
    padding: 16px;
`;

export const Column = styled.div`
    flex: 1;
    padding: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-right: 16px;

    &:last-child {
        margin-right: 0;
    }
`;

export const QuoteContainer = styled.div`
    margin-bottom: 16px;
`;

export const FormContainer = styled.div`
    margin-top: 16px;
`;

export const CommentContainer = styled.div`
    margin-bottom: 8px;
`;

export const ReactionContainer = styled.div`
    margin-bottom: 8px;
`;

export const Button = styled.button`
    margin-top: 8px;
    padding: 8px 16px;
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 4px;
`;

export const Input = styled.input`
    width: 100%;
    padding: 8px;
    margin-bottom: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

interface IFormProps {
    onSubmit: (payload: Pick<IQuote, 'text' | 'author'>) => void;
    buttonText: string;
}

export const Form: FC<IFormProps> = ({ onSubmit, buttonText }) => {
    const [text, setText] = useState('');
    const [author, setAuthor] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (text) {
            onSubmit({ text, author });
            setText('');
            setAuthor('');
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <Input
                    value={text}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
                    placeholder="Enter text..."
                />
                <Input
                    value={author}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAuthor(e.target.value)}
                    placeholder="Author"
                />
                <Button type="submit">{buttonText}</Button>
            </form>
        </FormContainer>
    );
};

interface IRandomQuoteProps {
    quote: IQuote | null;
}

export const RandomQuote: FC<IRandomQuoteProps> = ({ quote }) => (
    <QuoteContainer>
        <h3>Random Quote</h3>
        {quote ? (
            <>
                <p><strong>{quote.author}</strong>: {quote.text}</p>
            </>
        ) : (
            <p>No quote available.</p>
        )}
    </QuoteContainer>
);

interface ICommentsListProps {
    comments: IComment[];
}

export const CommentsList: FC<ICommentsListProps> = ({ comments }) => (
    <>
        <h3>Comments</h3>
        {comments.map((comment) => (
            <CommentContainer key={comment.id}>
                <p><strong>{comment.author}</strong>: {comment.text}</p>
            </CommentContainer>
        ))}
    </>
);

interface IReactionsListProps {
    reactions: IReaction[];
    onAddReaction: (type: ReactionType) => void;
}

export const ReactionsList: FC<IReactionsListProps> = ({ reactions, onAddReaction }) => {
    const [selectedReaction, setSelectedReaction] = useState<ReactionType>(ReactionType.LIKE);

    const handleAddReaction = () => {
        onAddReaction(selectedReaction);
    };

    return (
        <>
            <h3>Reactions</h3>
            <select value={selectedReaction} onChange={(e) => setSelectedReaction(e.target.value as ReactionType)}>
                {Object.values(ReactionType).map((type) => (
                    <option key={type} value={type}>{type}</option>
                ))}
            </select>
            <Button onClick={handleAddReaction}>Add Reaction</Button>
            {reactions.map((reaction) => (
                <ReactionContainer key={reaction.id}>
                    <p>{reaction.type}</p>
                </ReactionContainer>
            ))}
        </>
    );
};