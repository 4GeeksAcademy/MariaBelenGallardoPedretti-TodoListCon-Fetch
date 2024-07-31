import React, { useRef, useState, useEffect } from "react";

function TodoList() {
    const [tareas, setTareas] = useState([]);
    const nuevaTareaRef = useRef(null);
    const refrescarTareas = ()=>{
        fetch('https://playground.4geeks.com/todo/users/MARIABELENGALLARDOPEDRETTI')
            .then(response => response.json())
            .then(data => {
               setTareas(data.todos);
            })
            .catch(error => console.error('Error al cargar tareas:', error));
    }
    useEffect(() => {
        refrescarTareas()
    }, []);

    const agregarTarea = (e) => {
        if (e.key === "Enter") {
            const nuevaTarea = nuevaTareaRef.current.value.trim();
            if (nuevaTarea !== "") {
                fetch('https://playground.4geeks.com/todo/todos/MARIABELENGALLARDOPEDRETTI', {
                    method: 'POST',
                    body: JSON.stringify({ label: nuevaTarea, is_done: false }),
                    headers: {
                        'Content-Type': 'application/json'
                    }                  
                })
                .then(response => response.json())
                .then(data => {
                    setTareas((tareas) => [...tareas, data]);
                    nuevaTareaRef.current.value = "";               
                })
                .catch(error => console.error('Error al agregar la tarea:', error));
            }
        }
    }

    const borrarTarea = (index) => {
        const tareaABorrar = tareas[index];
        fetch(`https://playground.4geeks.com/todo/todos/${tareaABorrar.id}`, {
            method: 'DELETE'
        })
        
        .catch(error => console.error('Error deleting task:', error));
    }

    const borrarTodo = () => {
        for (let i = 0; i<tareas.length; i++){
            borrarTarea(i);
            console.log(i);
        }
        refrescarTareas();
    }

    return (
        <div className="container">
            <h1 className="text-center">Mi Lista de Tareas</h1>
            <input type="text" ref={nuevaTareaRef} placeholder="Introducir nueva tarea" onKeyDown={agregarTarea} />
            {Array.isArray(tareas) && tareas.length === 0 ? (
                <p>No hay tareas, añadir tareas</p>
            ) : (
                <ul>
                    {Array.isArray(tareas) && tareas.map((tarea, index) => (
                        <div className="text-center" key={index}>
                            <li>{tarea.label}<button onClick={() => borrarTarea(index)}><i className="fa-solid fa-trash-can"></i></button></li>
                        </div>
                    ))}
                </ul>
            )}
            <div className="d-flex justify-content-center align-items-center w-100 mb-1">
                <button type="button" className="text-center" onClick={() => borrarTodo()}>Finalizar todas las tareas</button>
            </div>
            <div>{tareas.length} tareas</div>            
        </div>
    );
}

export default TodoList;
