import './App.css';
import Chat from './pages/Chat/Index';
import Login from './pages/Login';
import useAuth from './hooks/useAuth'

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      {/* Verifica se o usuario está logado */}
      { user ?  <Chat></Chat> : <Login></Login> } 
    </div>
  );
}

export default App;
