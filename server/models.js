const mongoose = require('mongoose');

const toJSONTransform = (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
};

// Схема цитаты
const quoteSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true // Текст цитаты обязателен
    },
    author: {
        type: String,
        default: 'Anonymous'
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    reactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reaction'
    }]
});

quoteSchema.set('toJSON', {
    transform: toJSONTransform
});

// Схема комментария
const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true // Текст комментария обязателен
    },
    author: {
        type: String,
        default: 'Anonymous' // Имя автора по умолчанию - "Anonymous"
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на цитату
        ref: 'Quote',
        default: null
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на родительский комментарий, если это вложенный комментарий
        ref: 'Comment',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

commentSchema.virtual('replies', {
    ref: 'Comment',
    localField: '_id',
    foreignField: 'parentComment'
});

commentSchema.set('toJSON', {
    transform: toJSONTransform,
    virtuals: true
});

// Схема реакции
const reactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['like', 'dislike', 'love', 'angry', 'happy'], // Определяем допустимые типы реакций
        required: true
    },
    quote: {
        type: mongoose.Schema.Types.ObjectId, // Ссылка на цитату
        ref: 'Quote',
        required: true // Обязательно указывать цитату
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

reactionSchema.set('toJSON', {
    transform: toJSONTransform
});

// Модели
const Quote = mongoose.model('Quote', quoteSchema);
const Comment = mongoose.model('Comment', commentSchema);
const Reaction = mongoose.model('Reaction', reactionSchema);

module.exports = {
    Quote,
    Comment,
    Reaction
};
