import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from '~/types';
import * as flashcardsApi from '~/lib/api/flashcards';

/**
 * Query keys for TanStack Query
 */
export const flashcardKeys = {
  all: ['flashcards'] as const,
  lists: () => [...flashcardKeys.all, 'list'] as const,
  list: (filters: string) => [...flashcardKeys.lists(), filters] as const,
  details: () => [...flashcardKeys.all, 'detail'] as const,
  detail: (id: string) => [...flashcardKeys.details(), id] as const,
};

/**
 * Hook to fetch all flashcards
 */
export function useFlashcards() {
  return useQuery({
    queryKey: flashcardKeys.lists(),
    queryFn: flashcardsApi.getFlashcards,
  });
}

/**
 * Hook to fetch a single flashcard by ID
 */
export function useFlashcard(id: string) {
  return useQuery({
    queryKey: flashcardKeys.detail(id),
    queryFn: () => flashcardsApi.getFlashcard(id),
    enabled: !!id,
  });
}

/**
 * Hook to create a new flashcard
 */
export function useCreateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateFlashcardInput) =>
      flashcardsApi.createFlashcard(input),
    onSuccess: (newCard) => {
      // Invalidate and refetch flashcards list
      queryClient.invalidateQueries({ queryKey: flashcardKeys.lists() });
      
      toast.success('Flashcard created successfully!');
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create flashcard'
      );
    },
  });
}

/**
 * Hook to update a flashcard
 */
export function useUpdateFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateFlashcardInput) =>
      flashcardsApi.updateFlashcard(input),
    onMutate: async (input) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: flashcardKeys.lists() });
      await queryClient.cancelQueries({ queryKey: flashcardKeys.detail(input.id) });

      // Snapshot previous values
      const previousFlashcards = queryClient.getQueryData<Flashcard[]>(
        flashcardKeys.lists()
      );
      const previousFlashcard = queryClient.getQueryData<Flashcard>(
        flashcardKeys.detail(input.id)
      );

      // Optimistically update
      if (previousFlashcards) {
        queryClient.setQueryData<Flashcard[]>(
          flashcardKeys.lists(),
          (old) =>
            old?.map((card) =>
              card.id === input.id ? { ...card, ...input } : card
            ) || []
        );
      }

      if (previousFlashcard) {
        queryClient.setQueryData<Flashcard>(flashcardKeys.detail(input.id), {
          ...previousFlashcard,
          ...input,
        });
      }

      return { previousFlashcards, previousFlashcard };
    },
    onError: (error, input, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          flashcardKeys.lists(),
          context.previousFlashcards
        );
      }
      if (context?.previousFlashcard) {
        queryClient.setQueryData(
          flashcardKeys.detail(input.id),
          context.previousFlashcard
        );
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to update flashcard'
      );
    },
    onSuccess: () => {
      toast.success('Flashcard updated successfully!');
    },
    onSettled: (data, error, input) => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: flashcardKeys.lists() });
      queryClient.invalidateQueries({ queryKey: flashcardKeys.detail(input.id) });
    },
  });
}

/**
 * Hook to delete a flashcard
 */
export function useDeleteFlashcard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flashcardsApi.deleteFlashcard(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: flashcardKeys.lists() });

      const previousFlashcards = queryClient.getQueryData<Flashcard[]>(
        flashcardKeys.lists()
      );

      // Optimistically remove
      if (previousFlashcards) {
        queryClient.setQueryData<Flashcard[]>(
          flashcardKeys.lists(),
          (old) => old?.filter((card) => card.id !== id) || []
        );
      }

      return { previousFlashcards };
    },
    onError: (error, id, context) => {
      // Rollback on error
      if (context?.previousFlashcards) {
        queryClient.setQueryData(
          flashcardKeys.lists(),
          context.previousFlashcards
        );
      }
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete flashcard'
      );
    },
    onSuccess: () => {
      toast.success('Flashcard deleted successfully!');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.lists() });
    },
  });
}

/**
 * Hook to increment the mastery level
 */
export function useIncrementMasteryLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flashcardsApi.incrementMasteryLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.lists() });
    },
  });
}

/**
 * Hook to reset the mastery level
 */
export function useResetMasteryLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => flashcardsApi.resetMasteryLevel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: flashcardKeys.lists() });
      toast.success('Progress reset successfully!');
    },
  });
}
