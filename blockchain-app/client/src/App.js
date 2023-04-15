
import './App.css';
import Navbar from "./components/Navbar";
import Main from "./components/Main";

function App() {
  console.log(window.ethereum);
  return (
    <div className='App'>
      <Navbar />
      <Main />
    </div>
  );
}

export default App;
