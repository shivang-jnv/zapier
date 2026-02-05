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
const client_1 = require("@prisma/client");
const prismaClient = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield prismaClient.availableTrigger.upsert({
            where: { id: "webhook" },
            update: {},
            create: {
                id: "webhook",
                name: "Webhook",
                image: "https://img.icons8.com/color/1200/webhook.jpg"
            }
        });
        yield prismaClient.availableAction.upsert({
            where: { id: "send-sol" },
            update: {},
            create: {
                id: "send-sol",
                name: "Send Solana",
                image: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png"
            }
        });
        yield prismaClient.availableAction.upsert({
            where: { id: "email" },
            update: {},
            create: {
                id: "email",
                name: "Send Email",
                image: "https://cdn.pixabay.com/photo/2016/01/26/17/15/gmail-1162901_640.png"
            }
        });
    });
}
main();
