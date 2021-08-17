import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import Navbar from './components/Navbar';
import MainMenu from './components/MainMenu';
import NewMatch from './components/NewMatch';
import AnnotationInterface from './components/AnnotationInterface';

function App() {
  const baseUrl = 'http://localhost:3001';

  return (
    <div className="App">
      <Navbar />
      <Router>
        <Route path="/home">
          <MainMenu />
        </Route>
        <Route exact path="/">
          <Redirect to="/home"></Redirect>
        </Route>
        <Route path="/annotate">
          <AnnotationInterface />
        </Route>
        <Route path="/new/match">
          <NewMatch />
        </Route>
        <Route path="/match/:id">
          <AnnotationInterface baseUrl={baseUrl} />
        </Route>
      </Router>
    </div>
  );
}

export default App;
