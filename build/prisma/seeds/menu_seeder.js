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
const MenuSeeder = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
    yield prisma.appMenu.deleteMany();
    const modulSetting = yield prisma.appModul.findFirst({
        where: {
            code: "SETTING",
        },
    });
    const modulCV = yield prisma.appModul.findFirst({
        where: {
            code: "CV",
        },
    });
    const curriculumVitaeMenu = [
        {
            app_modul_id: (_a = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _a !== void 0 ? _a : 0,
            code: "CV_PROFILE",
            name: "Profile",
            route: "/cv/profile",
            order: 1,
        },
        {
            app_modul_id: (_b = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _b !== void 0 ? _b : 0,
            code: "CV_EXPERIENCE",
            name: "Experience",
            route: "/cv/experience",
            order: 2,
        },
        {
            app_modul_id: (_c = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _c !== void 0 ? _c : 0,
            code: "CV_EDUCATION",
            name: "Education",
            route: "/cv/education",
            order: 3,
        },
        {
            app_modul_id: (_d = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _d !== void 0 ? _d : 0,
            code: "CV_SKILL",
            name: "Skill",
            route: "/cv/skill",
            order: 4,
        },
        {
            app_modul_id: (_e = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _e !== void 0 ? _e : 0,
            code: "CV_LICENSE_CERTIFICATE",
            name: "License & Certificate",
            route: "/cv/license_certificate",
            order: 5,
        },
        {
            app_modul_id: (_f = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _f !== void 0 ? _f : 0,
            code: "CV_PORTFOLIO",
            name: "Portfolio",
            route: "/cv/portfolio",
            order: 6,
        },
        {
            app_modul_id: (_g = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _g !== void 0 ? _g : 0,
            code: "CV_CONTACT",
            name: "Kontak",
            route: "/cv/contact",
            order: 7,
        },
        {
            app_modul_id: (_h = modulCV === null || modulCV === void 0 ? void 0 : modulCV.id) !== null && _h !== void 0 ? _h : 0,
            code: "CV_PREVIEW",
            name: "Preview",
            route: "/cv/preview",
            order: 8,
        },
    ];
    const settingMenu = [
        {
            app_modul_id: (_j = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _j !== void 0 ? _j : 0,
            code: "SETTING_USER_GROUP",
            name: "Management User Group",
            route: "/setting/user_group",
            order: 1,
        },
        {
            app_modul_id: (_k = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _k !== void 0 ? _k : 0,
            code: "SETTING_USER",
            name: "Management User",
            route: "/setting/user",
            order: 2,
        },
        {
            app_modul_id: (_l = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _l !== void 0 ? _l : 0,
            code: "SETTING_MODUL",
            name: "Modul",
            route: "/setting/modul",
            order: 3,
        },
        {
            app_modul_id: (_m = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _m !== void 0 ? _m : 0,
            code: "SETTING_MENU",
            name: "Menu",
            route: "/setting/menu",
            order: 4,
        },
        {
            app_modul_id: (_o = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _o !== void 0 ? _o : 0,
            code: "SETTING_ACCESS_MODUL",
            name: "Akses Modul",
            route: "/setting/access_modul",
            order: 5,
        },
        {
            app_modul_id: (_p = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _p !== void 0 ? _p : 0,
            code: "SETTING_ACCESS_MENU",
            name: "Akses Menu",
            route: "/setting/access_menu",
            order: 6,
        },
        {
            app_modul_id: (_q = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _q !== void 0 ? _q : 0,
            code: "SETTING_MASTER_CATEGORY",
            name: "Master Kategori",
            route: "/setting/master_category",
            order: 7,
        },
        {
            app_modul_id: (_r = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _r !== void 0 ? _r : 0,
            code: "SETTING_DOCUMENTATION",
            name: "Dokumentasi",
            route: "/setting/documentation",
            order: 8,
        },
        {
            app_modul_id: (_s = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _s !== void 0 ? _s : 0,
            code: "SETTING_PARAMETER",
            name: "Parameter",
            route: "/setting/parameter",
            order: 9,
        },
        // Parent & Children Menu EXAMPLE
        {
            app_modul_id: (_t = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _t !== void 0 ? _t : 0,
            code: "SETTING_PARENT_MENU",
            name: "Parent Menu",
            route: "?/setting/parent",
            order: 10,
        },
    ];
    yield prisma.appMenu.createMany({
        data: [...settingMenu, ...curriculumVitaeMenu],
    });
    const parentMenu = yield prisma.appMenu.findFirst({
        where: { code: "SETTING_PARENT_MENU" },
    });
    yield prisma.appMenu.createMany({
        data: [
            {
                app_modul_id: (_u = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _u !== void 0 ? _u : 0,
                app_menu_id_parent: (_v = parentMenu === null || parentMenu === void 0 ? void 0 : parentMenu.id) !== null && _v !== void 0 ? _v : 0,
                code: "SETTING_CHILDREN_1",
                name: "Children Menu 1",
                route: "/setting/parent/children_1",
                order: 11,
            },
            {
                app_modul_id: (_w = modulSetting === null || modulSetting === void 0 ? void 0 : modulSetting.id) !== null && _w !== void 0 ? _w : 0,
                app_menu_id_parent: (_x = parentMenu === null || parentMenu === void 0 ? void 0 : parentMenu.id) !== null && _x !== void 0 ? _x : 0,
                code: "SETTING_CHILDREN_2",
                name: "Children Menu 2",
                route: "/setting/parent/children_2",
                order: 12,
            },
        ],
    });
});
exports.default = MenuSeeder;
