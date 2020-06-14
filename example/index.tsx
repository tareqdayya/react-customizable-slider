import 'react-app-polyfill/ie11';
import * as React from 'react';
import { useState } from 'react';
import * as ReactDOM from 'react-dom';
import Slider from '../.';

const App = () => {
  const [value, setValue] = useState<number>(100);

  return (
    <div style={{ width: 300, margin: 'auto', marginTop: 100 }}>
      <Slider
        max={200}
        min={50}
        value={value}
        renderTrack={() => <div style={{ height: 2, background: '#c7c7c7', width: '100%' }} />}
        renderThumb={() => <div style={{ height: 15, width: 15, borderRadius: 50, background: 'blue' }} />}
        onChange={setValue}
      />

      <h4>{value}</h4>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
