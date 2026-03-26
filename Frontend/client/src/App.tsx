import React from 'react';
import GraphView from './Components/GraphView';
import ChatBox from './Components/ChatBox';

const App: React.FC = () => {
  const [highlighted, setHighlighted] = React.useState<string[]>([]);
  console.log(highlighted);

  return (
    <div className="flex">
      <div className="w-3/4">
        <GraphView highlightedNodes={highlighted} />
      </div>

      <div className="w-1/4">
        <ChatBox setHighlighted={setHighlighted} />
      </div>
    </div>
  );
};

export default App;