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
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Calculate study statistics from flashcards
 */
export function calculateStatistics(flashcards: Flashcard[]): StudyStatistics {
  const total = flashcards.length;
  const mastered = flashcards.filter((card) => card.knownCount === 5).length;
  const inProgress = flashcards.filter(
    (card) => card.knownCount > 0 && card.knownCount < 5
  ).length;
  const notStarted = flashcards.filter((card) => card.knownCount === 0).length;

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
  if (filters.categories.length > 0) {
    filtered = filtered.filter((card) =>
      filters.categories.includes(card.category)
    );
  }

  // Hide mastered cards
  if (filters.hideMastered) {
    filtered = filtered.filter((card) => card.knownCount < 5);
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
export function getMasteryStatus(knownCount: number): string {
  if (knownCount === 0) return 'Not Started';
  if (knownCount === 5) return 'Mastered';
  return 'In Progress';
}

/**
 * Get mastery color class for Tailwind
 */
export function getMasteryColor(knownCount: number): string {
  if (knownCount === 0) return 'text-gray-500';
  if (knownCount < 3) return 'text-orange-500';
  if (knownCount < 5) return 'text-blue-500';
  return 'text-green-500';
}

/**
 * Get progress percentage
 */
export function getProgressPercentage(knownCount: number): number {
  return (knownCount / 5) * 100;
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
