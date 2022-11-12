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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.V1PortfolioController = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class V1PortfolioController {
}
exports.V1PortfolioController = V1PortfolioController;
_a = V1PortfolioController;
V1PortfolioController.getByUsernameAndSlug = (ctx, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, slug } = ctx.params;
        const portfolio = yield prisma.cVPortfolio.findFirstOrThrow({
            where: {
                slug: slug,
                user: {
                    username: username,
                },
            },
            include: {
                urls: true,
            },
        });
        ctx.status = 200;
        return (ctx.body = {
            success: true,
            data: portfolio,
        });
    }
    catch (error) {
        console.log({ error });
        let message;
        if (error instanceof Error)
            message = error.message;
        else
            message = String(error);
        ctx.status = error.statusCode || error.status || 500;
        return (ctx.body = {
            success: false,
            message: message,
        });
    }
});
