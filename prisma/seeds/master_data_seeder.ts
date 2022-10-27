import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MasterDataSeeder = async () => {
  await prisma.masterData.deleteMany();
  const levelSkillCategory = await prisma.masterCategory.findFirst({
    where: { code: "LEVEL_SKILL" },
  });
  const kodeTempalteWeb = await prisma.masterCategory.findFirst({
    where: { code: "KODE_TEMPLATE_WEB" },
  });

  const dataLevel = [
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_BEGINNER",
      name: "Beginner",
      order: 1,
      parameter1_key: "color",
      parameter1_value: "#9AD0EC",
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_BASIC",
      name: "Basic",
      order: 2,
      parameter1_key: "color",
      parameter1_value: "#1572A1",
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_INTERMEDIATE",
      name: "Intermediate",
      order: 3,
      parameter1_key: "color",
      parameter1_value: "#F5B971",
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_ADVANCE",
      name: "Advance",
      order: 4,
      parameter1_key: "color",
      parameter1_value: "#D45079",
    },
  ];

  const dataKodeTempalteWebsite = [
    // Kageki Shoujo
    {
      master_category_id: kodeTempalteWeb!.id,
      master_category_code: kodeTempalteWeb!.code,
      code: "KODE_TEMPLATE_WEB_WATANASA",
      name: "Watanasa",
      description: "Watanabe Sarasa",
      order: 1,
    },
    {
      master_category_id: kodeTempalteWeb!.id,
      master_category_code: kodeTempalteWeb!.code,
      code: "KODE_TEMPLATE_WEB_NARAAI",
      name: "Naraai",
      description: "Narata Ai",
      order: 2,
    },
    {
      master_category_id: kodeTempalteWeb!.id,
      master_category_code: kodeTempalteWeb!.code,
      code: "KODE_TEMPLATE_WEB_HOSHIRU",
      name: "Hoshiru",
      description: "Hoshino Kaoru",
      order: 3,
    },
    {
      master_category_id: kodeTempalteWeb!.id,
      master_category_code: kodeTempalteWeb!.code,
      code: "KODE_TEMPLATE_WEB_YAMAKO",
      name: "Yamako",
      description: "Yamada Ayako",
      order: 4,
    },
  ];
  await prisma.masterData.createMany({
    data: [...dataLevel, ...dataKodeTempalteWebsite],
  });
};

export default MasterDataSeeder;
