import { useState } from 'react';
import flashcardsData from '../data/data.json';
import type { Route } from './+types/study-mode';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Study Mode | Flashcard App' },
    { name: 'description', content: 'Study your flashcards' },
  ];
}

export default function StudyMode() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [hideMastered, setHideMastered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isFlipped, setIsFlipped] = useState(false);

  const flashcards = flashcardsData.flashcards;

  // Filter cards based on settings
  const filteredCards = flashcards.filter((card) => {
    const categoryMatch =
      selectedCategory === 'All Categories' ||
      card.category === selectedCategory;
    const masteredFilter = hideMastered ? card.knownCount < 5 : true;
    return categoryMatch && masteredFilter;
  });

  // Get unique categories
  const categories = [
    'All Categories',
    ...new Set(flashcards.map((card) => card.category)),
  ];

  const currentCard = filteredCards[currentCardIndex];

  // Calculate statistics
  const totalCards = flashcards.length;
  const mastered = flashcards.filter((card) => card.knownCount >= 5).length;
  const inProgress = flashcards.filter(
    (card) => card.knownCount > 0 && card.knownCount < 5
  ).length;
  const notStarted = flashcards.filter((card) => card.knownCount === 0).length;

  const handlePrevious = () => {
    setCurrentCardIndex((prev) =>
      prev > 0 ? prev - 1 : filteredCards.length - 1
    );
    setIsFlipped(false);
  };

  const handleNext = () => {
    setCurrentCardIndex((prev) =>
      prev < filteredCards.length - 1 ? prev + 1 : 0
    );
    setIsFlipped(false);
  };

  const handleShuffle = () => {
    setCurrentCardIndex(Math.floor(Math.random() * filteredCards.length));
    setIsFlipped(false);
  };

  const handleResetProgress = () => {
    // TODO: Implement reset progress functionality
    console.log('Reset progress');
  };

  const handleIKnowThis = () => {
    // TODO: Implement increment known count functionality
    console.log('I know this');
    handleNext();
  };

  return (
    <div>
      <h1>Study Mode</h1>
      <a href="/all-cards">All Cards</a>

      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={hideMastered}
            onChange={(e) => setHideMastered(e.target.checked)}
          />
          Hide Mastered
        </label>

        <button onClick={handleShuffle}>Shuffle</button>
      </div>

      {currentCard ? (
        <div onClick={() => setIsFlipped(!isFlipped)}>
          <h2>{isFlipped ? 'Answer' : 'Question'}</h2>
          <p>{isFlipped ? currentCard.answer : currentCard.question}</p>
          <p>Category: {currentCard.category}</p>
          <p>Progress: {currentCard.knownCount}/5</p>
        </div>
      ) : (
        <p>No cards available with current filters</p>
      )}

      <div>
        <button onClick={handleIKnowThis}>I Know This</button>
        <button onClick={handleResetProgress}>Reset Progress</button>
      </div>

      <div>
        <button onClick={handlePrevious}>Previous</button>
        <span>
          {currentCardIndex + 1} / {filteredCards.length}
        </span>
        <button onClick={handleNext}>Next</button>
      </div>

      <div>
        <h2>Study Statistics</h2>
        <p>Total Cards: {totalCards}</p>
        <p>Mastered: {mastered}</p>
        <p>In Progress: {inProgress}</p>
        <p>Not Started: {notStarted}</p>
      </div>
    </div>
  );
}
