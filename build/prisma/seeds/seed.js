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
const user_group_seeder_1 = __importDefault(require("./user_group_seeder"));
const modul_seeder_1 = __importDefault(require("./modul_seeder"));
const users_seeder_1 = __importDefault(require("./users_seeder"));
const menu_seeder_1 = __importDefault(require("./menu_seeder"));
const access_modul_seeder_1 = __importDefault(require("./access_modul_seeder"));
const access_menu_seeder_1 = __importDefault(require("./access_menu_seeder"));
const client_1 = require("@prisma/client");
const master_category_seeder_1 = __importDefault(require("./master_category_seeder"));
const master_data_seeder_1 = __importDefault(require("./master_data_seeder"));
const prisma = new client_1.PrismaClient();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        /// Disabled foreign key check
        yield prisma.$queryRaw `SET FOREIGN_KEY_CHECKS=0;`;
        yield (0, user_group_seeder_1.default)();
        yield (0, users_seeder_1.default)();
        yield (0, modul_seeder_1.default)();
        yield (0, menu_seeder_1.default)();
        yield (0, access_modul_seeder_1.default)();
        yield (0, access_menu_seeder_1.default)();
        yield (0, master_category_seeder_1.default)();
        yield (0, master_data_seeder_1.default)();
        /// Enabled Foreign key check
        yield prisma.$queryRaw `SET FOREIGN_KEY_CHECKS=1;`;
    }
    catch (error) {
        console.log({
            errorSeeder: error,
        });
    }
    finally {
        yield prisma.$disconnect();
    }
});
main();
