import React from 'react';
import * as ReactDOM from 'react-dom';
import { Default as Chips } from '../stories/Chips.stories';

describe('Chips', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Chips value={['foo']} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
