import './App.css';
import { Route } from "react-router-dom";
import Homepage from './pages/homepage';
import Chatpage from './pages/chatpage';


function App() {
  return (
    <div className="App">
      {/* <Button colorScheme='blue'>Button</Button> */}
      <Route path="/" component={Homepage} exact/>
      <Route path="/chats" component={Chatpage} />
    </div>
  );
}

export default App;

