import Validator from "fastest-validator";
import Router from "koa-router";
import { v4 as uuidV4 } from "uuid";

import { PrismaClient } from "@prisma/client";

const validator = new Validator();
const prisma = new PrismaClient();
const CVPreviewRouter = new Router({ prefix: "/api/cv/preview" });

CVPreviewRouter.get("/pdf/:users_id", async (ctx, next) => {
  const { users_id } = ctx.params;

  const profile = await prisma.cVProfile.findFirst({
    include: { user: true },
    where: { users_id: +users_id },
  });

  const education = await prisma.cVEducation.findMany({
    include: { user: true },
    where: { users_id: +users_id },
    orderBy: { start_date: "desc" },
  });

  const experience = await prisma.cVExperience.findMany({
    where: { users_id: +users_id },
    orderBy: { start_date: "desc" },
  });

  const skill = await prisma.cVSkill.findMany({
    include: {
      level: true,
      user: true,
    },
    where: { users_id: +users_id },
    orderBy: {
      level: { order: "asc" },
    },
  });

  const licenseAndCertificate = await prisma.cVLicenseCertificate.findMany({
    where: { users_id: +users_id },
    include: {
      user: true,
    },
    orderBy: {
      start_date: "asc",
    },
  });

  const portfolio = await prisma.cVPortfolio.findMany({
    include: { urls: true, user: true },
    where: { users_id: +users_id },
    orderBy: { title: "asc" },
  });

  const masterLevel = await prisma.masterData.findMany({
    where: {
      master_category: {
        code: "LEVEL_SKILL",
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  ctx.status = 200;
  return (ctx.body = {
    message: "Berhasil mendapatkan data preview",
    data: {
      profile,
      education,
      experience,
      skill,
      licenseAndCertificate,
      portfolio,
      master_level: masterLevel,
    },
  });
});

export default CVPreviewRouter;
