"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerPrismaError = void 0;
const client_1 = require("@prisma/client");
const handlerPrismaError = (e) => {
    if (e instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        console.log({ type: "Prisma.PrismaClientKnownRequestError" });
    }
    else if (e instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        console.log({ type: "Prisma.PrismaClientUnknownRequestError" });
    }
    else if (e instanceof client_1.Prisma.PrismaClientRustPanicError) {
        console.log({ type: "Prisma.PrismaClientRustPanicError" });
    }
    else if (e instanceof client_1.Prisma.PrismaClientInitializationError) {
        console.log({ type: "Prisma.PrismaClientInitializationError" });
    }
    else if (e instanceof client_1.Prisma.PrismaClientValidationError) {
        console.log({ type: "Prisma.PrismaClientValidationError" });
    }
    else {
        console.log({ type: "Unknown Prisma Error, Re-throw again" });
        throw e;
    }
};
exports.handlerPrismaError = handlerPrismaError;
