import React, { useState } from 'react';
import { Chips, Props } from '../src/Chips';
import '../css/chips.css';
import '../css/chip.css';

export default {
  title: 'Welcome',
};

// By passing optional props to this story, you can control the props of the component when
// you consume the story in a test.
export const Default = (props: Props) => <Chips {...props} />;

const suggestions = [
  'JavaScript',
  'Ruby',
  'Python',
  'Java',
  'Swift',
  'C++',
  'C',
  'Objective C',
  'Go',
];

export const Basic = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Chips
      value={value}
      placeholder="Type a Programming Language"
      suggestions={suggestions}
      fromSuggestionsOnly={false}
      highlightFirstSuggestion={true}
      onChange={setValue}
    />
  );
};

const fetchSuggestions = (value: string) => {
  return new Promise<string[]>((resolve) => {
    if (value.length >= 1) {
      setTimeout(() => {
        let filtered = suggestions.filter(
          (opt) => opt.toLowerCase().indexOf(value.toLowerCase()) !== -1
        );
        resolve(filtered);
      }, 1000);
    } else {
      resolve([]);
    }
  });
};

export const Async = () => {
  const [value, setValue] = useState<string[]>([]);
  return (
    <Chips
      value={value}
      onChange={setValue}
      placeholder="Type a Programming Language"
      fetchSuggestions={fetchSuggestions}
    />
  );
};
