import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';

interface AddPriorityProps {
  onAdd: (text: string) => void;
}

export const AddPriority = ({ onAdd }: AddPriorityProps) => {
  const [text, setText] = useState('');
  const [isInputVisible, setIsInputVisible] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim());
      setText('');
      setIsInputVisible(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setText('');
      setIsInputVisible(false);
    }
  };

  if (!isInputVisible) {
    return (
      <button
        onClick={() => setIsInputVisible(true)}
        className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors duration-200 flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-5 h-5" />
        Add Priority
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="What's your priority today?"
        className="w-full p-2 border border-gray-200 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        autoFocus
      />
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
        <button
          type="button"
          onClick={() => {
            setText('');
            setIsInputVisible(false);
          }}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};