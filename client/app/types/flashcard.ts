/**
 * Core flashcard type representing a single flashcard
 */
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  category: string;
  knownCount: number; // Mastery level: 0-5
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
export type UpdateFlashcardInput = Partial<
  Omit<Flashcard, 'id' | 'createdAt'>
> & {
  id: string;
};

/**
 * Category with count information for filters
 */
export interface CategoryWithCount {
  name: string;
  count: number;
}

/**
 * Study statistics
 */
export interface StudyStatistics {
  total: number;
  mastered: number; // knownCount === 5
  inProgress: number; // knownCount > 0 && knownCount < 5
  notStarted: number; // knownCount === 0
}

/**
 * Filter options for flashcards
 */
export interface FlashcardFilters {
  categories: string[];
  hideMastered: boolean;
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
