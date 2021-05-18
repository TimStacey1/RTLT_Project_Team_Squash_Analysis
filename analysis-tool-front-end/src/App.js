import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './components/MainMenu';
import AnnotationInterface from './components/AnnotationInterface';

function App() {
  return (
    <div className="App">
      <Navbar/>
      <Router>
        <Route path="/home">
          <MainMenu/>
        </Route>
        <Route exact path="/">
          <Redirect to="/home"></Redirect>
        </Route>
        <Route path="/annotate">
          <AnnotationInterface/>
        </Route>
      </Router>
    </div>
  );
}

export default App;
