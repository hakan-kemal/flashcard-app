import type {
  Flashcard,
  CategoryWithCount,
  StudyStatistics,
  FlashcardFilters,
} from '~/types';

/**
 * Get unique categories from flashcards with their counts
 */
export function getCategoriesWithCounts(
  flashcards: Flashcard[]
): CategoryWithCount[] {
  const categoryMap = new Map<string, number>();

  flashcards.forEach((card) => {
    const count = categoryMap.get(card.category) || 0;
    categoryMap.set(card.category, count + 1);
  });

  return Array.from(categoryMap.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => a.category.localeCompare(b.category));
}

/**
 * Calculate study statistics from flashcards
 */
export function calculateStatistics(flashcards: Flashcard[]): StudyStatistics {
  const total = flashcards.length;
  const mastered = flashcards.filter((card) => card.masteryLevel === 5).length;
  const inProgress = flashcards.filter(
    (card) => card.masteryLevel > 0 && card.masteryLevel < 5
  ).length;
  const notStarted = flashcards.filter((card) => card.masteryLevel === 0).length;

  return {
    total,
    mastered,
    inProgress,
    notStarted,
  };
}

/**
 * Filter flashcards based on filters
 */
export function filterFlashcards(
  flashcards: Flashcard[],
  filters: FlashcardFilters
): Flashcard[] {
  let filtered = [...flashcards];

  // Filter by categories
  if (filters.categories && filters.categories.length > 0) {
    filtered = filtered.filter((card) => filters.categories!.includes(card.category));
  }

  // Hide mastered cards
  if (filters.hideMastered) {
    filtered = filtered.filter((card) => card.masteryLevel < 5);
  }

  // Search by question or answer
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (card) =>
        card.question.toLowerCase().includes(query) ||
        card.answer.toLowerCase().includes(query)
    );
  }

  return filtered;
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 */
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Get mastery status text
 */
export function getMasteryStatus(masteryLevel: number): string {
  if (masteryLevel === 0) return 'Not Started';
  if (masteryLevel === 5) return 'Mastered';
  return 'In Progress';
}

/**
 * Get mastery color class for Tailwind
 */
export function getMasteryColor(masteryLevel: number): string {
  if (masteryLevel === 0) return 'text-gray-500';
  if (masteryLevel < 3) return 'text-orange-500';
  if (masteryLevel < 5) return 'text-blue-500';
  return 'text-green-500';
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(masteryLevel: number): number {
  return (masteryLevel / 5) * 100;
}

/**
 * Format date for display
 */
export function formatDate(dateString: string | undefined): string {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Combine class names conditionally
 */
export function cn(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
