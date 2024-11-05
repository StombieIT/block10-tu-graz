const express = require('express');
const { Quote, Comment, Reaction } = require('./models');

const commentsRouter = express.Router();

// Создать новый комментарий к цитате или другому комментарию
commentsRouter.post('/comments/add', async (req, res) => {
    try {
        const { text, author, quoteId, parentCommentId } = req.body;

        // Проверка на наличие хотя бы одного идентификатора и отсутствие обоих
        if (!quoteId && !parentCommentId) {
            return res.status(400).json({ error: 'Comment must relate to a quote or another comment' });
        }
        if (quoteId && parentCommentId) {
            return res.status(400).json({ error: 'Comment cannot relate to both a quote and another comment' });
        }

        // Проверка существования цитаты, если указан quoteId
        if (quoteId) {
            const quote = await Quote.findById(quoteId);
            if (!quote) {
                return res.status(404).json({ error: 'Quote not found' });
            }
        }

        // Проверка существования родительского комментария, если указан parentCommentId
        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId);
            if (!parentComment) {
                return res.status(404).json({ error: 'Parent comment not found' });
            }
        }

        // Создание нового комментария
        const comment = new Comment({
            text,
            author,
            quote: quoteId || null, // Устанавливаем quote, если есть quoteId
            parentComment: parentCommentId || null // Устанавливаем parentComment, если есть parentCommentId
        });

        await comment.save();

        // Добавляем ID комментария в список comments у цитаты, если комментарий относится к цитате
        if (quoteId) {
            const quote = await Quote.findById(quoteId);
            quote.comments.push(comment._id);
            await quote.save();
        }

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить конкретный комментарий по его ID, включая ответы
commentsRouter.get('/comments/:commentId', async (req, res) => {
    try {
        const { commentId } = req.params;

        // Находим комментарий с его вложенными ответами
        const comment = await Comment.findById(commentId).populate('replies');
        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        res.json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const reactionsRouter = express.Router();

// Добавление реакции к цитате
reactionsRouter.post('/reactions/add-to-quote/:quoteId', async (req, res) => {
    try {
        const { type } = req.body; // Ожидаем только тип реакции
        const { quoteId } = req.params;

        // Проверка существования цитаты
        const quote = await Quote.findById(quoteId);
        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        // Создание новой реакции
        const reaction = new Reaction({
            type,
            quote: quoteId // Привязываем реакцию к цитате
        });

        await reaction.save();

        // Добавление ID реакции в массив reactions цитаты
        quote.reactions.push(reaction._id);
        await quote.save();

        res.status(201).json(reaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Эндпоинт для получения конкретной реакции по ID
reactionsRouter.get('/reactions/:id', async (req, res) => {
    try {
        const reactionId = req.params.id;

        // Проверка существования реакции
        const reaction = await Reaction.findById(reactionId);
        if (!reaction) {
            return res.status(404).json({ error: 'Reaction not found' });
        }

        res.status(200).json(reaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const quotesRouter = express.Router();

// Создать новую цитату
quotesRouter.post('/quotes/add', async (req, res) => {
    try {
        const { text, author } = req.body;

        // Создание новой цитаты
        const quote = new Quote({ text, author });
        await quote.save();

        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить все цитаты
quotesRouter.get('/quotes', async (req, res) => {
    try {
        const quotes = await Quote.find().populate('comments').populate('reactions');
        res.json(quotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить случайную цитату
quotesRouter.get('/quotes/random', async (req, res) => {
    try {
        const count = await Quote.countDocuments();
        if (count === 0) {
            console.log('SMECOUNT', count);
            return res.status(404).json({ error: 'No quotes available' });
        }

        const randomIndex = Math.floor(Math.random() * count);
        const randomQuote = await Quote.findOne().skip(randomIndex).populate('comments').populate('reactions');

        res.json(randomQuote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получить цитату по ID с комментариями
quotesRouter.get('/quotes/:quoteId', async (req, res) => {
    try {
        const { quoteId } = req.params;

        const quote = await Quote.findById(quoteId).populate('comments').populate('reactions');

        if (!quote) {
            return res.status(404).json({ error: 'Quote not found' });
        }

        res.json(quote);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = {
    quotesRouter,
    commentsRouter,
    reactionsRouter
};
