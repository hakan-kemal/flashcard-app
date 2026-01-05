import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from '~/types';
import { nanoid } from 'nanoid';
import flashcardsData from '~/data/data.json';

const STORAGE_KEY = 'flashcards';

/**
 * Initialize localStorage with data from data.json if not already set
 */
function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(flashcardsData.flashcards)
    );
  }
}

/**
 * Get all flashcards from localStorage
 */
export async function getFlashcards(): Promise<Flashcard[]> {
  // Simulate API delay for realistic behavior
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (typeof window === 'undefined') {
    return flashcardsData.flashcards as Flashcard[];
  }

  initializeStorage();
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

/**
 * Get a single flashcard by ID
 */
export async function getFlashcard(id: string): Promise<Flashcard | null> {
  const flashcards = await getFlashcards();
  return flashcards.find((card) => card.id === id) || null;
}

/**
 * Create a new flashcard
 */
export async function createFlashcard(
  input: CreateFlashcardInput
): Promise<Flashcard> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const newCard: Flashcard = {
    ...input,
    id: nanoid(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const flashcards = await getFlashcards();
  const updated = [...flashcards, newCard];

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  return newCard;
}

/**
 * Update an existing flashcard
 */
export async function updateFlashcard(
  input: UpdateFlashcardInput
): Promise<Flashcard> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const flashcards = await getFlashcards();
  const index = flashcards.findIndex((card) => card.id === input.id);

  if (index === -1) {
    throw new Error(`Flashcard with id ${input.id} not found`);
  }

  const updatedCard: Flashcard = {
    ...flashcards[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  flashcards[index] = updatedCard;

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
  }

  return updatedCard;
}

/**
 * Delete a flashcard
 */
export async function deleteFlashcard(id: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  const flashcards = await getFlashcards();
  const filtered = flashcards.filter((card) => card.id !== id);

  if (filtered.length === flashcards.length) {
    throw new Error(`Flashcard with id ${id} not found`);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  }
}

/**
 * Increment the known count (mastery level) of a flashcard
 */
export async function incrementKnownCount(id: string): Promise<Flashcard> {
  const flashcards = await getFlashcards();
  const card = flashcards.find((c) => c.id === id);

  if (!card) {
    throw new Error(`Flashcard with id ${id} not found`);
  }

  return updateFlashcard({
    id,
    knownCount: Math.min(card.knownCount + 1, 5),
  });
}

/**
 * Reset the known count (mastery level) of a flashcard
 */
export async function resetKnownCount(id: string): Promise<Flashcard> {
  return updateFlashcard({
    id,
    knownCount: 0,
  });
}

/**
 * Clear all flashcards (useful for testing)
 */
export async function clearAllFlashcards(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Reset to initial data from data.json
 */
export async function resetToInitialData(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(flashcardsData.flashcards)
    );
  }
}
