import React, { useState } from 'react';
import './App.css';

function App() {
  const [playerName, setPlayerName] = useState('');
  const [showGame, setShowGame] = useState(false);

  const handleStartGame = () => {
    setShowGame(true);
  };

  return (
    <div className="Menu_app">
      <header className="Menu_header">
        <nav className='Menu_sidebar'>
          <div className='Button_play' onClick={handleStartGame}>Jugar</div>
          <div className='Button_historial'>Historial</div>
          <div className='Button_rules'>Reglas</div>
        </nav>
        <div className='MenuWallpaper'>
          <h1 className='Title_name'>Preguntadas</h1>
        </div>
      </header>
      <div className='ContentMenu'>
        {!showGame ? (
          <div className="Name_input">
            <input 
              type="text" 
              placeholder="Ingresa tu nombre" 
              value={playerName} 
              onChange={(e) => setPlayerName(e.target.value)} 
            />
            <button onClick={handleStartGame}>Empezar</button>
          </div>
        ) : (
          <>
            <div className="Name_bar">Jugador: {playerName}</div>
            <div className='ContentMenu_play'>
              <div className="Bar_questions">
                {/* Zona de preguntas. Conexión a BD */}
                ¿Cuál es la capital de Francia?
              </div>
              <div className="ResponseButton">París</div>
              <div className="ResponseButton">Londres</div>
              <div className="ResponseButton">Roma</div>
              <div className="ResponseButton">Madrid</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
