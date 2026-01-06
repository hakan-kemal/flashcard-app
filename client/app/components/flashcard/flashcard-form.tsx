import { useState, useEffect } from 'react';
import type {
  Flashcard,
  CreateFlashcardInput,
  UpdateFlashcardInput,
} from '~/types';
import { Input, Textarea, Select, Button } from '~/components/ui';

export interface FlashcardFormProps {
  flashcard?: Flashcard;
  categories: string[];
  onSubmit: (data: CreateFlashcardInput | UpdateFlashcardInput) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function FlashcardForm({
  flashcard,
  categories,
  onSubmit,
  onCancel,
  isLoading,
}: FlashcardFormProps) {
  const [formData, setFormData] = useState({
    question: flashcard?.question || '',
    answer: flashcard?.answer || '',
    category: flashcard?.category || categories[0] || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (flashcard) {
      setFormData({
        question: flashcard.question,
        answer: flashcard.answer,
        category: flashcard.category,
      });
    }
  }, [flashcard]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.question.trim()) {
      newErrors.question = 'Question is required';
    } else if (formData.question.trim().length < 3) {
      newErrors.question = 'Question must be at least 3 characters';
    }

    if (!formData.answer.trim()) {
      newErrors.answer = 'Answer is required';
    } else if (formData.answer.trim().length < 3) {
      newErrors.answer = 'Answer must be at least 3 characters';
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit(formData as CreateFlashcardInput);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Generate category options with "Add new..." option
  const categoryOptions = [
    ...categories.map((cat) => ({ value: cat, label: cat })),
    { value: '__new__', label: '+ Add new category' },
  ];

  const [isNewCategory, setIsNewCategory] = useState(false);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__new__') {
      setIsNewCategory(true);
      setFormData((prev) => ({ ...prev, category: '' }));
    } else {
      setIsNewCategory(false);
      handleChange(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="question"
        label="Question"
        placeholder="Enter your question..."
        value={formData.question}
        onChange={handleChange}
        error={errors.question}
        disabled={isLoading}
        autoFocus
      />

      <Textarea
        name="answer"
        label="Answer"
        placeholder="Enter the answer..."
        value={formData.answer}
        onChange={handleChange}
        error={errors.answer}
        disabled={isLoading}
        rows={4}
      />

      {isNewCategory ? (
        <div>
          <Input
            name="category"
            label="New Category"
            placeholder="Enter new category name..."
            value={formData.category}
            onChange={handleChange}
            error={errors.category}
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => {
              setIsNewCategory(false);
              setFormData((prev) => ({
                ...prev,
                category: categories[0] || '',
              }));
            }}
            className="mt-1 text-sm text-blue-600 hover:underline"
          >
            Choose existing category
          </button>
        </div>
      ) : (
        <Select
          name="category"
          label="Category"
          value={formData.category}
          onChange={handleCategoryChange}
          options={categoryOptions}
          error={errors.category}
          disabled={isLoading}
        />
      )}

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" isLoading={isLoading}>
          {flashcard ? 'Update' : 'Create'} Flashcard
        </Button>
      </div>
    </form>
  );
}
