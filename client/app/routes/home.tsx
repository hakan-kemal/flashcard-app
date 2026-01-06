import { useState, useMemo } from 'react';
import { toast } from 'sonner';
import type { Route } from './+types/home';
import {
  useFlashcards,
  useCreateFlashcard,
  useUpdateFlashcard,
  useDeleteFlashcard,
  useIncrementMasteryLevel,
  useResetMasteryLevel,
} from '~/hooks';
import { useUIStore } from '~/stores';
import {
  getCategoriesWithCounts,
  calculateStatistics,
  filterFlashcards,
  shuffleArray,
} from '~/lib/utils';
import { FlashcardList, FlashcardForm } from '~/components/flashcard';
import { Button, Modal, MultiSelect } from '~/components/ui';
import type { Flashcard } from '~/types';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Flashcard App' },
    {
      name: 'description',
      content: 'Master your knowledge with interactive flashcards',
    },
  ];
}

export default function Home() {
  const { data: flashcards = [], isLoading } = useFlashcards();
  const createMutation = useCreateFlashcard();
  const updateMutation = useUpdateFlashcard();
  const deleteMutation = useDeleteFlashcard();
  const incrementMutation = useIncrementMasteryLevel();
  const resetMutation = useResetMasteryLevel();

  const {
    viewMode,
    setViewMode,
    filters,
    setFilters,
    currentCardIndex,
    setCurrentCardIndex,
    isCardFlipped,
    setIsCardFlipped,
    isShuffled,
    setIsShuffled,
    modalState,
    openModal,
    closeModal,
  } = useUIStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [editingFlashcard, setEditingFlashcard] = useState<
    Flashcard | undefined
  >();

  const categories = getCategoriesWithCounts(flashcards);
  const allCategories = categories.map((c) => c.category);
  const stats = calculateStatistics(flashcards);

  // Filter and optionally shuffle flashcards
  const filteredFlashcards = useMemo(() => {
    let filtered = filterFlashcards(flashcards, filters);

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (card) =>
          card.question.toLowerCase().includes(query) ||
          card.answer.toLowerCase().includes(query)
      );
    }

    // Shuffle if enabled
    if (isShuffled) {
      return shuffleArray([...filtered]);
    }

    return filtered;
  }, [flashcards, filters, searchQuery, isShuffled]);

  const currentCard = filteredFlashcards[currentCardIndex];

  // Handlers
  const handleCreate = (data: any) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        closeModal();
        toast.success('Flashcard created successfully');
      },
      onError: () => {
        toast.error('Failed to create flashcard');
      },
    });
  };

  const handleUpdate = (data: any) => {
    if (!editingFlashcard) return;
    updateMutation.mutate(
      { id: editingFlashcard.id, ...data },
      {
        onSuccess: () => {
          closeModal();
          setEditingFlashcard(undefined);
          toast.success('Flashcard updated successfully');
        },
        onError: () => {
          toast.error('Failed to update flashcard');
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Flashcard deleted successfully');
      },
      onError: () => {
        toast.error('Failed to delete flashcard');
      },
    });
  };

  const handleIncrement = (id: string) => {
    incrementMutation.mutate(id);
  };

  const handleReset = (id: string) => {
    resetMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Progress reset');
      },
    });
  };

  const handleEdit = (flashcard: Flashcard) => {
    setEditingFlashcard(flashcard);
    openModal('createEdit');
  };

  const handleOpenCreate = () => {
    setEditingFlashcard(undefined);
    openModal('createEdit');
  };

  const handleCloseModal = () => {
    closeModal();
    setEditingFlashcard(undefined);
  };

  const handleFlipCard = () => {
    setIsCardFlipped(!isCardFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < filteredFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsCardFlipped(false);
    }
  };

  const handlePreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsCardFlipped(false);
    }
  };

  const handleShuffle = () => {
    setIsShuffled(!isShuffled);
    setCurrentCardIndex(0);
    toast.success(isShuffled ? 'Shuffle disabled' : 'Cards shuffled');
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
          <p className="text-gray-600">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header with Logo and View Toggle */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-400">
              <span className="text-2xl">🎓</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Flashcard</h1>
          </div>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-full border-2 border-gray-900 bg-white p-1">
            <button
              onClick={() => setViewMode('study')}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                viewMode === 'study'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              Study Mode
            </button>
            <button
              onClick={() => setViewMode('all')}
              className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                viewMode === 'all'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
            >
              All Cards
            </button>
          </div>
        </div>

        {viewMode === 'all' ? (
          // ALL CARDS VIEW
          <div>
            {/* Create Card Form */}
            <div className="mb-6 rounded-2xl border-2 border-gray-900 bg-white p-6">
              <div className="mb-4 flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-400 text-sm">
                  ➕
                </span>
                <h2 className="text-lg font-semibold text-gray-900">
                  Create Card
                </h2>
              </div>
              <Button
                onClick={handleOpenCreate}
                variant="primary"
                className="w-full"
              >
                + Create New Flashcard
              </Button>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap items-center gap-4">
              <MultiSelect
                value={filters.categories || []}
                onChange={(values) => setFilters({ categories: values })}
                options={categories.map((cat) => ({
                  value: cat.category,
                  label: cat.category,
                  count: cat.count,
                }))}
                className="w-64"
              />
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={filters.hideMastered || false}
                  onChange={(e) =>
                    setFilters({ hideMastered: e.target.checked })
                  }
                  className="rounded border-gray-300"
                />
                Hide Mastered
              </label>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleShuffle}
                className="ml-auto"
              >
                🔀 Shuffle
              </Button>
            </div>

            {/* Flashcard Grid */}
            <FlashcardList
              flashcards={filteredFlashcards}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onIncrement={handleIncrement}
              onReset={handleReset}
              emptyMessage="No flashcards match your filters"
            />
          </div>
        ) : (
          // STUDY MODE VIEW
          <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
            {/* Left: Study Card */}
            <div>
              {/* Filters */}
              <div className="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4">
                <MultiSelect
                  value={filters.categories || []}
                  onChange={(values) => setFilters({ categories: values })}
                  options={categories.map((cat) => ({
                    value: cat.category,
                    label: cat.category,
                    count: cat.count,
                  }))}
                  className="w-64"
                />
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.hideMastered || false}
                    onChange={(e) =>
                      setFilters({ hideMastered: e.target.checked })
                    }
                    className="rounded border-gray-300"
                  />
                  Hide Mastered
                </label>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShuffle}
                  className="ml-auto"
                >
                  🔀 Shuffle
                </Button>
              </div>

              {currentCard ? (
                <div className="rounded-2xl border-2 border-gray-900 bg-white p-8">
                  {/* Card */}
                  <div
                    onClick={handleFlipCard}
                    className="mb-6 flex h-80 cursor-pointer items-center justify-center rounded-2xl bg-gradient-to-br from-pink-400 to-purple-400 p-8 text-center transition-all hover:shadow-lg"
                  >
                    <div>
                      <div className="mb-4 inline-block rounded-full bg-white/90 px-4 py-1 text-sm font-medium text-gray-900">
                        {currentCard.category}
                      </div>
                      <h2 className="mb-4 text-3xl font-bold text-gray-900">
                        {isCardFlipped
                          ? currentCard.answer
                          : currentCard.question}
                      </h2>
                      <p className="text-sm text-gray-700">
                        {isCardFlipped ? '' : 'Click to reveal answer'}
                      </p>
                      <div className="mt-6 flex items-center justify-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-white/50">
                          <div
                            className="h-full bg-white transition-all"
                            style={{
                              width: `${(currentCard.masteryLevel / 5) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-sm text-white">
                          {currentCard.masteryLevel}/5
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mb-6 flex justify-center gap-4">
                    <Button
                      variant="primary"
                      size="lg"
                      onClick={() => handleIncrement(currentCard.id)}
                      disabled={currentCard.masteryLevel >= 5}
                    >
                      ✓ I Know This
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => handleReset(currentCard.id)}
                      disabled={currentCard.masteryLevel === 0}
                    >
                      🔄 Reset Progress
                    </Button>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      onClick={handlePreviousCard}
                      disabled={currentCardIndex === 0}
                    >
                      ← Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Card {currentCardIndex + 1} of {filteredFlashcards.length}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={handleNextCard}
                      disabled={
                        currentCardIndex === filteredFlashcards.length - 1
                      }
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed border-gray-300 bg-white p-12 text-center">
                  <p className="text-lg font-medium text-gray-900">
                    No flashcards to study
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    Adjust your filters or create new flashcards
                  </p>
                </div>
              )}
            </div>

            {/* Right: Statistics */}
            <div className="lg:w-80">
              <div className="sticky top-6 rounded-2xl border-2 border-gray-900 bg-white p-6">
                <h2 className="mb-4 text-xl font-bold text-gray-900">
                  Study Statistics
                </h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 bg-blue-100 p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Total Cards
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.total}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-200">
                      <span className="text-2xl">📚</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 bg-teal-100 p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Mastered
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.mastered}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-200">
                      <span className="text-2xl">✓</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 bg-pink-100 p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        In Progress
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.inProgress}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-200">
                      <span className="text-2xl">📖</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border-2 border-gray-900 bg-purple-100 p-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-700">
                        Not Started
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stats.notStarted}
                      </p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-200">
                      <span className="text-2xl">📝</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create/Edit Modal */}
        <Modal
          isOpen={modalState.createEdit}
          onClose={handleCloseModal}
          title={editingFlashcard ? 'Edit Flashcard' : 'Create Flashcard'}
          size="lg"
        >
          <FlashcardForm
            flashcard={editingFlashcard}
            categories={allCategories}
            onSubmit={editingFlashcard ? handleUpdate : handleCreate}
            onCancel={handleCloseModal}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </Modal>
      </div>
    </div>
  );
}
