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
exports.queryOpenAI = exports.createEmbedding = void 0;
const openai_1 = require("openai");
const configuration = new openai_1.Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new openai_1.OpenAIApi(configuration);
const createEmbedding = (text) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.createEmbedding({
        model: 'text-embedding-ada-002',
        input: text,
    });
    return response.data.data[0].embedding;
});
exports.createEmbedding = createEmbedding;
const queryOpenAI = (message) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield openai.createCompletion({
        model: 'gpt-4',
        prompt: message,
        max_tokens: 150,
    });
    return response.data.choices[0].text;
});
exports.queryOpenAI = queryOpenAI;
