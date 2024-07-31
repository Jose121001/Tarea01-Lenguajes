import './App.css';

function App() {
  return (
    <div className="Menu_app">
      <header className="Menu_header">
        <nav className='Menu_sidebar'>
          <div className='Button_play'>Jugar</div>
          <div className='Button_historial'>Historial</div>
          <div className='Button_rules'>Reglas</div>
        </nav>
        <div className='MenuWallpaper'>
          <h1 className='Title_name'>Preguntadas</h1>
        </div>
      </header>
      <div className='ContentMenu'>
        <div className='ContentMenu_play'>
          <div className="Bar_questions">
            {/* Zona de preguntas. Coneccion a DB */}
            ¿Cuál es la capital de Francia?
          </div>
          <div className="ResponseButton">París</div>
          <div className="ResponseButton">Londres</div>
          <div className="ResponseButton">Roma</div>
          <div className="ResponseButton">Madrid</div>
        </div>
      </div>
    </div>
  );
}

export default App;
