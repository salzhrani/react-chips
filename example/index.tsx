import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Chips } from '../src';

const App = () => {
  return (
    <div>
      <Chips value={[]} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
