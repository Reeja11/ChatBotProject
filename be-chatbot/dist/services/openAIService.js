"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatHandler = void 0;
const openai_1 = require("openai");
// import { generateEmbedding } from '../utils/embeddings';
const embeddings_1 = require("../utils/embeddings");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const chatHandler = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const embedding = yield (0, embeddings_1.createEmbedding)(query);
    const response = yield openai.createCompletion({
        model: 'text-davinci-003',
        prompt: query,
        max_tokens: 100,
        temperature: 0.7,
        stream: true,
    });
});
exports.chatHandler = chatHandler;
