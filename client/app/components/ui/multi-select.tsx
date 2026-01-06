import { useState, useRef, useEffect } from 'react';

export interface MultiSelectProps {
  value: string[];
  onChange: (values: string[]) => void;
  options: Array<{ value: string; label: string; count?: number }>;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  value = [],
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const displayText =
    value.length === 0
      ? 'All Categories'
      : value.length === 1
      ? value[0]
      : `${value.length} categories`;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-full border-2 border-gray-900 bg-white px-6 py-2.5 text-left text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span>{displayText}</span>
        <svg
          className={`h-5 w-5 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border-2 border-gray-900 bg-white shadow-lg">
          <div className="max-h-80 overflow-y-auto p-2">
            {value.length > 0 && (
              <button
                onClick={handleClearAll}
                className="mb-2 w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Clear all
              </button>
            )}
            {options.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg px-4 py-3 hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={value.includes(option.value)}
                  onChange={() => handleToggle(option.value)}
                  className="h-5 w-5 rounded border-2 border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <span className="flex-1 text-sm font-medium text-gray-900">
                  {option.label}
                  {option.count !== undefined && (
                    <span className="ml-2 text-gray-500">({option.count})</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
