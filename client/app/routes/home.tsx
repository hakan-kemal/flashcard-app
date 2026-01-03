import { Link } from 'react-router';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-8">
      <Link to="all-cards">Go to All Cards</Link>
      <Link to="study-mode">Go to Study Mode</Link>
    </div>
  );
}
