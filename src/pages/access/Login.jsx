import { useState } from "react";
import React from "react";
import { useNavigate } from 'react-router-dom';
import "./login.css"


function Login({ id, api }) {
    const [idInstance, setIdInstance] = useState("");
    const [apiTokenInstance, setApiTokenInstance] = useState("");
    const navigate = useNavigate();
    // const apiTokenInstance = '01d897031fe444ae81787e40313dbc6366e386ae05764abeb0';
    // const idInstance = '1101822516';

    function sendAccess() {
        const url = `https://api.green-api.com/waInstance${idInstance}/GetSettings/${apiTokenInstance}`;

        // Выполнение GET-запроса
        fetch(url)
            .then(response => {
                // Обработка ответа
                if (response.ok) {
                    return response.json(); // Возвращает результат в формате JSON
                } else {
                    throw new Error('Ошибка запроса'); // В случае ошибки выбрасывает исключение
                }
            })
            .then(data => {
                // Обработка полученных данных
                console.log(data); // Вывод полученных данных в консоль
                navigate('/Chat');
            })
            .catch(error => {
                // Обработка ошибок
                console.error(error); // Вывод ошибки в консоль
            });
    }

    function handleIdChange(e) {
        id(e.target.value)
        setIdInstance(e.target.value)

    }
    function handleApiChange(e) {
        api(e.target.value)
        setApiTokenInstance(e.target.value)
        
    }
    

    return (
        <div className="lgin__container">
            <h2 id="login__title">idInstance</h2>
            <input
                type="text"
                id="login__inp"
                value={idInstance}
                onChange={handleIdChange}
            />

            <h2 id="pass__title">apiTokenInstance</h2>
            <input
                type="text"
                id="pass__inp"
                value={apiTokenInstance}
                onChange={handleApiChange}
            />
            <button onClick={sendAccess} id="send__login__btn">Send</button>
        </div>
    );
}

export default Login;