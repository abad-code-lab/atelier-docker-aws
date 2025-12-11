
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import PersonList from './components/PersonList';
import PersonForm from './components/PersonForm';
import PersonDetails from './components/PersonDetails';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster position="top-right" />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<PersonList />} />
            <Route path="/create" element={<PersonForm />} />
            <Route path="/edit/:id" element={<PersonForm />} />
            <Route path="/view/:id" element={<PersonDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
