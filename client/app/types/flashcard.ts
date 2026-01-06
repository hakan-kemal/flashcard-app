/**
 * Core flashcard type representing a single flashcard
 */
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  masteryLevel: number; // Mastery level: 0-5
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Input type for creating a new flashcard (without id and timestamps)
 */
export type CreateFlashcardInput = Omit<
  Flashcard,
  'id' | 'createdAt' | 'updatedAt'
>;

/**
 * Input type for updating a flashcard
 */
export type UpdateFlashcardInput = {
  id: string;
} & Partial<Omit<Flashcard, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * Category with count information for filters
 */
export interface CategoryWithCount {
  category: string;
  count: number;
}

/**
 * Study statistics
 */
export interface StudyStatistics {
  total: number;
  mastered: number; // masteryLevel === 5
  inProgress: number; // masteryLevel > 0 && masteryLevel < 5
  notStarted: number; // masteryLevel === 0
}

/**
 * Filter options for flashcards
 */
export interface FlashcardFilters {
  categories?: string[];
  hideMastered?: boolean;
  searchQuery?: string;
}

/**
 * Sort options
 */
export type SortOption = 'newest' | 'oldest' | 'category' | 'mastery';

/**
 * View mode
 */
export type ViewMode = 'all' | 'study';
