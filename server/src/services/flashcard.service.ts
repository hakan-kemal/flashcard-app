import { PrismaClient } from '@prisma/client';
import data from '~/prisma/seed.json';

const prisma = new PrismaClient();

const seed = async () => {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.flashcard.deleteMany({});
  console.log('✨ Cleared existing flashcards');

  // Insert seed data
  const result = await prisma.flashcard.createMany({
    data: data.flashcards,
  });

  console.log(`✅ Seeded ${result.count} flashcards`);
};

seed()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export const flashcardService = {
  // Get all flashcards with optional filtering
  async getAll(filters?: { category?: string }) {
    return prisma.flashcard.findMany({
      where: filters?.category ? { category: filters.category } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  },

  // Get a single flashcard by ID
  async getById(id: string) {
    return prisma.flashcard.findUnique({
      where: { id },
    });
  },

  // Create a new flashcard
  async create(data: { question: string; answer: string; category: string }) {
    return prisma.flashcard.create({
      data,
    });
  },

  // Update a flashcard
  async update(
    id: string,
    data: { question?: string; answer?: string; category?: string }
  ) {
    return prisma.flashcard.update({
      where: { id },
      data,
    });
  },

  // Delete a flashcard
  async delete(id: string) {
    return prisma.flashcard.delete({
      where: { id },
    });
  },

  // Increment known count
  async incrementKnownCount(id: string) {
    return prisma.flashcard.update({
      where: { id },
      data: {
        knownCount: {
          increment: 1,
        },
      },
    });
  },

  // Reset known count
  async resetKnownCount(id: string) {
    return prisma.flashcard.update({
      where: { id },
      data: {
        knownCount: 0,
      },
    });
  },

  // Get categories with counts
  async getCategoriesWithCounts() {
    const flashcards = await prisma.flashcard.findMany({
      select: { category: true },
    });

    const categoryMap = flashcards.reduce((acc, card) => {
      acc[card.category] = (acc[card.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryMap).map(([category, count]) => ({
      category,
      count,
    }));
  },
};
