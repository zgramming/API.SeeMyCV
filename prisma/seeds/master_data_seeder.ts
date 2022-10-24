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
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_BASIC",
      name: "Basic",
      order: 2,
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_INTERMEDIATE",
      name: "Intermediate",
      order: 3,
    },
    {
      master_category_id: levelSkillCategory!.id,
      master_category_code: levelSkillCategory!.code,
      code: "LEVEL_SKILL_ADVANCE",
      name: "Advance",
      order: 4,
    },
  ];
  await prisma.masterData.createMany({ data: data });
};

export default MasterDataSeeder;
