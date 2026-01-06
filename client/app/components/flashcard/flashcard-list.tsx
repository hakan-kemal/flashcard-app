import { type Flashcard } from '~/types';
import { FlashcardCard } from './flashcard-card';

export interface FlashcardListProps {
  flashcards: Flashcard[];
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (id: string) => void;
  onIncrement?: (id: string) => void;
  onReset?: (id: string) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

export function FlashcardList({
  flashcards,
  onEdit,
  onDelete,
  onIncrement,
  onReset,
  showActions = true,
  emptyMessage = 'No flashcards found',
}: FlashcardListProps) {
  if (flashcards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-12">
        <svg
          className="mb-4 h-16 w-16 text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium text-gray-900">{emptyMessage}</p>
        <p className="mt-1 text-sm text-gray-500">
          Create your first flashcard to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {flashcards.map((flashcard) => (
        <FlashcardCard
          key={flashcard.id}
          flashcard={flashcard}
          onEdit={onEdit}
          onDelete={onDelete}
          onIncrement={onIncrement}
          onReset={onReset}
          showActions={showActions}
        />
      ))}
    </div>
  );
}
