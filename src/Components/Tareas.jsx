import React, { useState, useEffect } from 'react';

const Tareas = () => {
  const [tareas, setTareas] = useState([]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [hoverIndice, setHoverIndice] = useState(null);
  const userName = 'alesanchezr';

  useEffect(() => {
    fetch(`https://playground.4geeks.com/todo/users/${userName}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al obtener las tareas: ' + resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      if (Array.isArray(data.todos)) {
        setTareas(data.todos);
      } else {
        setTareas([]);
      }
    })
    .catch(error => {
      console.log(error);
      setTareas([]);
    });
  }, []);


  const crearTarea = (tarea) => {
    fetch(`https://playground.4geeks.com/todo/todos/${userName}`, {
      method: 'POST',
      body: JSON.stringify({ label: tarea, done: false }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al crear la tarea: ' + resp.statusText);
      }
      return resp.json();
    })
    .then(data => {
      setTareas([...tareas, data]);
    })
    .catch(error => console.log(error));
  };

  
  const eliminarTarea = (tareaId) => {
    fetch(`https://playground.4geeks.com/todo/todos/${tareaId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error al eliminar la tarea: ' + resp.statusText);
      }
      setTareas(tareas.filter(tarea => tarea.id !== tareaId));
    })
    .catch(error => console.log(error));
  };


  const agregarTarea = (e) => {
    if (e.key === 'Enter' && nuevaTarea.trim() !== '') {
      crearTarea(nuevaTarea);
      setNuevaTarea('');
    }
  };


  const eliminarTareaFrontEnd = (indice) => {
    const tareaId = tareas[indice].id;
    eliminarTarea(tareaId);
  };

  return (
    <div className="contenedor-todo" style={{ width: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h1 className='display-2 text-danger text-opacity-25'>todos</h1>
      <input type="text" placeholder="¿Qué se necesita hacer?" value={nuevaTarea} onChange={(e) => setNuevaTarea(e.target.value)} onKeyDown={agregarTarea} style={{ width: '100%', padding: '10px', fontSize: '18px' }}/>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.length === 0 ? (
          <li>No hay tareas, añade tareas</li>
        ) : (
          tareas.map((tarea, indice) => (
            <li key={indice} onMouseEnter={() => setHoverIndice(indice)} onMouseLeave={() => setHoverIndice(null)} style={{ padding: '10px', borderBottom: '1px solid #eee', fontSize: '18px', display: 'flex', justifyContent: 'space-between' }}>
              {tarea.label}
              {hoverIndice === indice && (
                <span onClick={() => eliminarTareaFrontEnd(indice)} style={{ cursor: 'pointer', color: 'red' }}>
                  &times;
                </span>
              )}
            </li>
          ))
        )}
      </ul>
      <div>{tareas.length} tarea{tareas.length !== 1 && 's'} restante{tareas.length !== 1 && 's'}</div>
    </div>
  );
};

export default Tareas;


