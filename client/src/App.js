import React, { useState } from 'react';
import Axios from "axios";
import './App.css';


function App() {
  const [playerName, setPlayerName] = useState('');
  const [showGame, setShowGame] = useState(false);

  //--------------Funciones de BD------------------------------------------------------------------------------------------------------------
  /**
   * en server utilizamos node install cors 
   * para evitar bloqueos de pagina.
   * Se importa en index.js pero del server
   * 
   */
  const [nombre, setNombre] = useState("");


  //Se usa para registrar en este caso el nombre
  const add = () => {
    Axios.post('http://localhost:3000/create', {
      nombre: nombre,
    }).then(() => {
      alert('Usuario registrado app.js');
    });
  };
//--------------Funciones de Juego-------------------------------------------------------------------------------------------------------------
   //Se incia el juego
   const handleStartGame = () => {
    console.log('Juego iniciado');
    setShowGame(true); // Cambia el estado para mostrar el juego
  };

  //Funcion que fuciona el handler y el add
  const handleButtonClick = () => {
    add();
    handleStartGame();
  };
  //Combina el setPlayer y agrega el setNomre para el add
  const handleChange = (e) => {
    setPlayerName(e.target.value);
    setNombre(e.target.value);
  };
//-------------Fin de Funciones de Juego------------------------------------------------------------------------------------------------------------------------------------------
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
              onChange={handleChange} 
            />
            <button onClick={handleButtonClick}>Jugar</button>
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
