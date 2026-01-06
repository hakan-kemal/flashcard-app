import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '~/components/ui';
import { getMasteryColor, getMasteryStatus } from '~/lib/utils';
import { type Flashcard } from '~/types';

export interface FlashcardCardProps {
  flashcard: Flashcard;
  onEdit?: (flashcard: Flashcard) => void;
  onDelete?: (id: string) => void;
  onIncrement?: (id: string) => void;
  onReset?: (id: string) => void;
  showActions?: boolean;
}

export function FlashcardCard({
  flashcard,
  onEdit,
  onDelete,
  onIncrement,
  onReset,
  showActions = true,
}: FlashcardCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const masteryStatus = getMasteryStatus(flashcard.masteryLevel);
  const masteryColor = getMasteryColor(flashcard.masteryLevel);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="group relative h-64 w-full perspective-1000">
      <motion.div
        className="relative h-full w-full cursor-pointer"
        onClick={handleFlip}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring' }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Side */}
        <div
          className="absolute inset-0 flex flex-col rounded-lg border-2 border-gray-200 bg-white p-6 shadow-md backface-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {flashcard.category}
            </span>
            <div className="flex items-center gap-1">
              <div
                className={`h-2 w-2 rounded-full ${masteryColor}`}
                title={masteryStatus}
              />
              <span className="text-xs text-gray-500">
                {flashcard.masteryLevel}/5
              </span>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-lg font-medium text-gray-900">
              {flashcard.question}
            </p>
          </div>

          <p className="text-center text-sm text-gray-400">
            Click to reveal answer
          </p>
        </div>

        {/* Back Side */}
        <div
          className="absolute inset-0 flex flex-col rounded-lg border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-md backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div className="mb-2 flex items-start justify-between">
            <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-blue-800">
              Answer
            </span>
            <span className="text-xs text-gray-600">
              {flashcard.masteryLevel}/5
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <p className="text-center text-lg text-gray-800">
              {flashcard.answer}
            </p>
          </div>

          <p className="text-center text-sm text-gray-500">
            Click to flip back
          </p>
        </div>
      </motion.div>

      {/* Action Buttons - Only show when not flipped and showActions is true */}
      {showActions && !isFlipped && (
        <div className="absolute -bottom-12 left-0 right-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          {onIncrement && (
            <Button
              size="sm"
              variant="primary"
              onClick={(e) => {
                e.stopPropagation();
                onIncrement(flashcard.id);
              }}
              disabled={flashcard.masteryLevel >= 5}
              title="Mark as known"
            >
              ✓
            </Button>
          )}
          {onReset && flashcard.masteryLevel > 0 && (
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                onReset(flashcard.id);
              }}
              title="Reset progress"
            >
              Reset
            </Button>
          )}
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(flashcard);
              }}
              title="Edit flashcard"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                if (
                  confirm('Are you sure you want to delete this flashcard?')
                ) {
                  onDelete(flashcard.id);
                }
              }}
              title="Delete flashcard"
            >
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
