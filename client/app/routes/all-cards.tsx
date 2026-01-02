import { useState } from "react";
import type { Route } from "./+types/all-cards";
import flashcardsData from "../data/data.json";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "All Cards | Flashcard App" },
    { name: "description", content: "View and create flashcards" },
  ];
}

export default function AllCards() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [hideMastered, setHideMastered] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const flashcards = flashcardsData.flashcards;

  // Filter cards based on settings
  const filteredCards = flashcards.filter(card => {
    const categoryMatch = selectedCategory === "All Categories" || card.category === selectedCategory;
    const masteredFilter = hideMastered ? card.knownCount < 5 : true;
    return categoryMatch && masteredFilter;
  });

  // Get unique categories
  const categories = ["All Categories", ...new Set(flashcards.map(card => card.category))];

  const handleCreateCard = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement card creation functionality
    console.log("Create card:", { question, answer, category });
    setQuestion("");
    setAnswer("");
    setCategory("");
  };

  const handleShuffle = () => {
    // TODO: Implement shuffle functionality
    console.log("Shuffle cards");
  };

  return (
    <div>
      <h1>All Cards</h1>
      <a href="/">Study Mode</a>

      <form onSubmit={handleCreateCard}>
        <div>
          <label htmlFor="question">Question</label>
          <input
            id="question"
            type="text"
            placeholder='e.g., "What is the capital of France?"'
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="answer">Answer</label>
          <input
            id="answer"
            type="text"
            placeholder='e.g., "Paris"'
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category">Category</label>
          <input
            id="category"
            type="text"
            placeholder='e.g., "Geography"'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <button type="submit">Create Card</button>
      </form>

      <div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
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

      <div>
        {filteredCards.map((card) => (
          <div key={card.id}>
            <h3>{card.question}</h3>
            <p>{card.answer}</p>
            <p>Category: {card.category}</p>
            <p>Progress: {card.knownCount}/5</p>
          </div>
        ))}
      </div>
    </div>
  );
}
