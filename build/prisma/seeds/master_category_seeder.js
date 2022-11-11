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
const prisma = new client_1.PrismaClient();
const MasterCategorySeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.masterCategory.deleteMany();
    const data = [
        { code: "LEVEL_SKILL", name: "Level Skill" },
        { code: "KODE_TEMPLATE_WEB", name: "Kode Template Website" },
        { code: "KODE_TEMPLATE_PDF", name: "Kode Template PDF" },
    ];
    yield prisma.masterCategory.createMany({ data: data });
});
exports.default = MasterCategorySeeder;
