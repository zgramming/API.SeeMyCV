import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const MasterDataSeeder = async () => {
  await prisma.masterData.deleteMany();
  const levelSkillCategory = await prisma.masterCategory.findFirst({
    where: { code: "LEVEL_SKILL" },
  });

  const data = [
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
  await prisma.masterData.createMany({ data: data });
};

export default MasterDataSeeder;
