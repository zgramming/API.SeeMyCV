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
const bcrypt_1 = require("bcrypt");
const saltRounds = 10;
const prisma = new client_1.PrismaClient();
const UsersSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield prisma.users.deleteMany();
    const superadmin = yield prisma.appGroupUser.findFirst({
        where: {
            code: "superadmin",
        },
    });
    const user = yield prisma.appGroupUser.findFirst({ where: { code: "user" } });
    const data = [
        {
            app_group_user_id: (_a = superadmin === null || superadmin === void 0 ? void 0 : superadmin.id) !== null && _a !== void 0 ? _a : 0,
            name: "Superadmin",
            email: "superadmin@gmail.com",
            username: "superadmin",
            password: (0, bcrypt_1.hashSync)("superadmin", saltRounds),
            status: "active",
        },
        {
            app_group_user_id: (_b = user === null || user === void 0 ? void 0 : user.id) !== null && _b !== void 0 ? _b : 0,
            name: "Zeffry Reynando",
            email: "zeffry.reynando@gmail.com",
            username: "zeffry",
            password: (0, bcrypt_1.hashSync)("zeffry", saltRounds),
            status: "active",
        },
    ];
    yield prisma.users.createMany({ data: data });
});
exports.default = UsersSeeder;
