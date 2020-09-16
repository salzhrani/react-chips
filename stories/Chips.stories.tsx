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

export const Basic = (props: Props) => {
  const [value, setValue] = useState([]);
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

const data = [
  { name: 'JavaScript', image: 'http://i.stack.imgur.com/Mmww2.png' },
  {
    name: 'Ruby',
    image:
      'https://www.sitepoint.com/wp-content/themes/sitepoint/assets/images/icon.ruby.png',
  },
  {
    name: 'Python',
    image:
      'http://www.iconarchive.com/download/i73027/cornmanthe3rd/plex/Other-python.ico',
  },
  {
    name: 'Java',
    image: 'https://cdn2.iconfinder.com/data/icons/metro-ui-dock/128/Java.png',
  },
  {
    name: 'Swift',
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcNaPStsM3XwWDAgvjFfT5RFcDxuynJUJmY4lH5PSMyhphA9hA',
  },
  {
    name: 'C++',
    image: 'http://www.freeiconspng.com/uploads/c--logo-icon-0.png',
  },
  {
    name: 'C',
    image: 'http://www.compindiatechnologies.com/images/icon/c.gif',
  },
  {
    name: 'Objective C',
    image:
      'http://2.bp.blogspot.com/-BuR1DpqQprU/U5CQ_0w2L7I/AAAAAAAABZY/H9wbfbO-kew/s1600/iOS_Objective_C.png',
  },
  {
    name: 'Go',
    image:
      'https://www.codemate.com/wp-content/uploads/2015/11/go-lang-icon-180x180.png',
  },
];

const fetchSuggestions = (value) => {
  return new Promise<string[]>((resolve, reject) => {
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

export const Async = (props: Props) => {
  const [value, setValue] = useState([]);
  return (
    <Chips
      value={value}
      onChange={setValue}
      placeholder="Type a Programming Language"
      fetchSuggestions={fetchSuggestions}
    />
  );
};
