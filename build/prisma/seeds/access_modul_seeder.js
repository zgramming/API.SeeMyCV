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
const AccessModulSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.appAccessModul.deleteMany();
    const superadmin = yield prisma.appGroupUser.findFirst({
        where: { code: "superadmin" },
    });
    const user = yield prisma.appGroupUser.findFirst({ where: { code: "user" } });
    const modul = yield prisma.appModul.findMany();
    const dataSuperadmin = modul.map((val, index) => {
        var _a;
        return {
            app_group_user_id: (_a = superadmin === null || superadmin === void 0 ? void 0 : superadmin.id) !== null && _a !== void 0 ? _a : 0,
            app_modul_id: val.id,
        };
    });
    const dataUser = modul
        .filter((val) => val.code == "CV")
        .map((val, index) => {
        var _a;
        return {
            app_group_user_id: (_a = user === null || user === void 0 ? void 0 : user.id) !== null && _a !== void 0 ? _a : 0,
            app_modul_id: val.id,
        };
    });
    yield prisma.appAccessModul.createMany({
        data: [...dataSuperadmin, ...dataUser],
    });
});
exports.default = AccessModulSeeder;
