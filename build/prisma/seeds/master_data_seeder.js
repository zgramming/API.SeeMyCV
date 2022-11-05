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
const MasterDataSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.masterData.deleteMany();
    const levelSkillCategory = yield prisma.masterCategory.findFirst({
        where: { code: "LEVEL_SKILL" },
    });
    const kodeTempalteWeb = yield prisma.masterCategory.findFirst({
        where: { code: "KODE_TEMPLATE_WEB" },
    });
    const dataLevel = [
        {
            master_category_id: levelSkillCategory.id,
            master_category_code: levelSkillCategory.code,
            code: "LEVEL_SKILL_BEGINNER",
            name: "Beginner",
            order: 1,
            parameter1_key: "color",
            parameter1_value: "#9AD0EC",
        },
        {
            master_category_id: levelSkillCategory.id,
            master_category_code: levelSkillCategory.code,
            code: "LEVEL_SKILL_BASIC",
            name: "Basic",
            order: 2,
            parameter1_key: "color",
            parameter1_value: "#1572A1",
        },
        {
            master_category_id: levelSkillCategory.id,
            master_category_code: levelSkillCategory.code,
            code: "LEVEL_SKILL_INTERMEDIATE",
            name: "Intermediate",
            order: 3,
            parameter1_key: "color",
            parameter1_value: "#F5B971",
        },
        {
            master_category_id: levelSkillCategory.id,
            master_category_code: levelSkillCategory.code,
            code: "LEVEL_SKILL_ADVANCE",
            name: "Advance",
            order: 4,
            parameter1_key: "color",
            parameter1_value: "#D45079",
        },
    ];
    const dataKodeTempalteWebsite = [
        // Kageki Shoujo
        /// Reference : https://lmpixels.com/demo/vido/vido_vcard_template_yellow/index.html
        {
            master_category_id: kodeTempalteWeb.id,
            master_category_code: kodeTempalteWeb.code,
            code: "KODE_TEMPLATE_WEB_WATANASA",
            name: "Watanasa",
            description: "Watanabe Sarasa",
            order: 1,
        },
        {
            master_category_id: kodeTempalteWeb.id,
            master_category_code: kodeTempalteWeb.code,
            code: "KODE_TEMPLATE_WEB_NARAAI",
            name: "Naraai",
            description: "Narata Ai",
            order: 2,
        },
        {
            master_category_id: kodeTempalteWeb.id,
            master_category_code: kodeTempalteWeb.code,
            code: "KODE_TEMPLATE_WEB_HOSHIRU",
            name: "Hoshiru",
            description: "Hoshino Kaoru",
            order: 3,
        },
        {
            master_category_id: kodeTempalteWeb.id,
            master_category_code: kodeTempalteWeb.code,
            code: "KODE_TEMPLATE_WEB_YAMAKO",
            name: "Yamako",
            description: "Yamada Ayako",
            order: 4,
        },
    ];
    yield prisma.masterData.createMany({
        data: [...dataLevel, ...dataKodeTempalteWebsite],
    });
});
exports.default = MasterDataSeeder;
