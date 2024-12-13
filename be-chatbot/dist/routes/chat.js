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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const openAIService_1 = require("../services/openAIService");
const router = express_1.default.Router();
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const response = yield (0, openAIService_1.chatHandler)(message);
        res.json(response);
    }
    catch (error) {
        console.error('Error in chat endpoint:', error);
        res.status(500).send({ error: 'Failed to process the request' });
    }
}));
exports.default = router;
// router.get('/', async (req, res) => {
//   res.setHeader('Content-Type', 'text/event-stream');
//   res.setHeader('Cache-Control', 'no-cache');
//   res.setHeader('Connection', 'keep-alive');
//   try {
//     const { query } = req.query;
//     const responseStream = await handleChat(query as string);
//     for await (const chunk of responseStream) {
//       res.write(`data: ${chunk}\n\n`);
//     }
//     res.end();
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
