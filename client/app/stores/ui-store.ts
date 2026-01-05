import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FlashcardFilters, ViewMode } from '~/types';

/**
 * UI Store - manages application UI state
 * Handles filters, view mode, modals, and other UI-related state
 */
interface UIStore {
  // View mode
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Filters
  filters: FlashcardFilters;
  setFilters: (filters: Partial<FlashcardFilters>) => void;
  resetFilters: () => void;

  // Study mode state
  currentCardIndex: number;
  isCardFlipped: boolean;
  isShuffled: boolean;
  setCurrentCardIndex: (index: number) => void;
  setIsCardFlipped: (flipped: boolean) => void;
  setIsShuffled: (shuffled: boolean) => void;
  flipCard: () => void;
  nextCard: (totalCards: number) => void;
  previousCard: () => void;
  resetStudyMode: () => void;

  // Modal state
  isCardFormOpen: boolean;
  editingCardId: string | null;
  openCardForm: (cardId?: string) => void;
  closeCardForm: () => void;

  // Pagination
  currentPage: number;
  cardsPerPage: number;
  setCurrentPage: (page: number) => void;
  loadMore: () => void;
  resetPagination: () => void;
}

const defaultFilters: FlashcardFilters = {
  categories: [],
  hideMastered: false,
  searchQuery: '',
};

export const useUIStore = create<UIStore>()(
  devtools(
    (set, get) => ({
      // View mode
      viewMode: 'all',
      setViewMode: (mode) => set({ viewMode: mode }),

      // Filters
      filters: defaultFilters,
      setFilters: (newFilters) =>
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
        })),
      resetFilters: () =>
        set({
          filters: defaultFilters,
        }),

      // Study mode
      currentCardIndex: 0,
      isCardFlipped: false,
      isShuffled: false,
      setCurrentCardIndex: (index) => set({ currentCardIndex: index }),
      setIsCardFlipped: (flipped) => set({ isCardFlipped: flipped }),
      setIsShuffled: (shuffled) => set({ isShuffled: shuffled }),
      flipCard: () => set((state) => ({ isCardFlipped: !state.isCardFlipped })),
      nextCard: (totalCards) =>
        set((state) => ({
          currentCardIndex: Math.min(
            state.currentCardIndex + 1,
            totalCards - 1
          ),
          isCardFlipped: false,
        })),
      previousCard: () =>
        set((state) => ({
          currentCardIndex: Math.max(state.currentCardIndex - 1, 0),
          isCardFlipped: false,
        })),
      resetStudyMode: () =>
        set({
          currentCardIndex: 0,
          isCardFlipped: false,
          isShuffled: false,
        }),

      // Modal
      isCardFormOpen: false,
      editingCardId: null,
      openCardForm: (cardId) =>
        set({
          isCardFormOpen: true,
          editingCardId: cardId || null,
        }),
      closeCardForm: () =>
        set({
          isCardFormOpen: false,
          editingCardId: null,
        }),

      // Pagination
      currentPage: 1,
      cardsPerPage: 12,
      setCurrentPage: (page) => set({ currentPage: page }),
      loadMore: () => set((state) => ({ currentPage: state.currentPage + 1 })),
      resetPagination: () => set({ currentPage: 1 }),
    }),
    {
      name: 'ui-store',
    }
  )
);
