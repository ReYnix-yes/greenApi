import React, { useEffect, useState } from "react";
import "./chat.css";
import { useNavigate } from "react-router-dom";
import "./historyChat.css"
import axios from "axios";

function Chat({ idInstance, apiTokenInstance }) {
    const navigate = useNavigate();
    if (idInstance === '' || idInstance === undefined || apiTokenInstance === '' || apiTokenInstance === undefined) {
        navigate('/');
    }

    let [dispNewChat, setDispNewChat] = useState("none");
    const [numValue, setNumValue] = useState("7");
    const [number, setNumber] = useState("");
    const [message, setMessage] = useState("");
    const [selectedName, setSelectedName] = useState("Not selected");
    const [selectedNumber, setSelectedNumber] = useState("Not selected");

    // Chats
    const [chats, setChats] = useState([
        {
            name: "Я",
            number: "79858296854",
        },
    ]);

    function sendMessage() {
        const url = `https://api.green-api.com/waInstance${idInstance}/SendMessage/${apiTokenInstance}`;

        const body = {
            chatId: `${selectedNumber}@c.us`,
            message: message,
        };

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error sending message');
                }
            })
            .then((data) => {
                console.log(data);
                // Дополнительная обработка данных после отправки сообщения
                setHistory(selectedNumber);
            })
            .catch((error) => {
                console.error(error);
                // Обработка ошибки
            });

        setMessage("");
    }

    function setNewChat() {
        let name = prompt("Введите имя");
        if (numValue.length === 11) {
            setDispNewChat("none");
            const newChat = {
                name: name,
                number: numValue,
            };
            setChats((prevChats) => [...prevChats, newChat]);
        } else {
            alert("Ошибка в номере");
            console.log(numValue.length);
        }
    }

    useEffect(() => {
        setHistory(selectedNumber);
    }, [selectedNumber]);

    function openChat(name, number) {
        setSelectedName(name);
        setSelectedNumber(number);
    }

    // History


    const [historyArray, setHistoryArray] = useState([[{}]]);
    const reversedHistory = historyArray[0].slice().reverse();

    function setHistory(numberHistory) {
        const HistoryUrl = `https://api.green-api.com/waInstance${idInstance}/GetChatHistory/${apiTokenInstance}`;
        const body = {
            chatId: `${numberHistory}@c.us`,
            count: 10,
        };

        fetch(HistoryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })
            .then(response => {
                if (response.ok) {
                    return response.json();


                } else {
                    throw new Error('Ошибка запроса');
                }
            })
            .then(data => {
                // Обновление массива истории
                setHistoryArray([data])
            })
            .catch(error => {
                console.error(error);
                // Обработка ошибок
            });
    }
    useEffect(() => {
        const receiveNotification = async () => {
            try {
                const response = await fetch(`https://api.green-api.com/waInstance${idInstance}/ReceiveNotification/${apiTokenInstance}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        // Дополнительные заголовки
                    },
                });

                if (response.ok) {
                    const notification = await response.json();

                    // Вывод уведомления в консоль
                    console.log('Received notification:', notification.body.messageData.textMessageData.textMessage);

                    // Метод DeleteNotification
                    const deleteNotification = async (receiptId) => {
                        try {
                            const deleteResponse = await fetch(`https://api.green-api.com/waInstance${idInstance}/DeleteNotification/${receiptId}`, {
                                method: 'DELETE',
                                headers: {
                                    'Content-Type': 'application/json',
                                    // Дополнительные заголовки
                                },
                            });

                            if (deleteResponse.ok) {
                                // Уведомление успешно получено и удалено из очереди
                                // Тут дописать
                            } else {
                                // Обработка ошибки при удалении уведомления
                                // Тут дописать
                            }
                        } catch (error) {
                            // Обработка ошибки
                            // Тут дописать
                        }
                    };

                    deleteNotification(notification.receiptId);
                } else {
                    // Обработка ошибки при получении уведомления
                    // Тут дописать
                }
            } catch (error) {
                // Обработка ошибки
                // Тут дописать
            }
        };

        receiveNotification();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `https://api.green-api.com/waInstance${idInstance}/lastIncomingMessages/${apiTokenInstance}?minutes=1440`
                );
                const messages = response.data;

                // Вывод сообщений в консоль
                console.log(messages);
            } catch (error) {
                console.error('Error fetching incoming messages:', error);
            }
        };

        fetchData();
    }, []);



    return (
        <>
            <main className="chat">
                <aside className="chat__aside">
                    <div className="new__chat" style={{ display: dispNewChat }}>
                        <p className="new__chat__title">Number:</p>
                        <input type="number" id="new__chat__inp" value={numValue} onChange={(e) => setNumValue(e.target.value)} />
                        <button onClick={setNewChat} className="add__btn">Добавить</button>
                        <button onClick={() => setDispNewChat('none')} className="add__btn">Закрыть</button>
                    </div>
                    <header className="aside__header">
                        <button onClick={() => setDispNewChat('block')} className="newChat__btn">Новый чат</button>
                    </header>
                    {chats.map(({ name, number }) => (
                        <button onClick={() => openChat(name, number)} key={number} className="chat__item">
                            <p className="item__title">{name}</p>
                        </button>
                    ))}



                </aside>

                <main className="chat__main">
                    <header className="chat__header">
                        <p className="title__chat">{selectedName}</p>
                        <p className="title__chat">{selectedNumber}</p>
                    </header>

                    <div className="chat__massage">
                        <div>
                            {reversedHistory.map(({ type, textMessage, idMessage }) => (
                                <div key={idMessage} className={`history__item__container ${type === "outgoing" ? "outgoing" : ""}`}>
                                    <div className={`history__item ${type === "outgoing" ? "outgoing" : ""}`}>
                                        {textMessage}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div id='chat__inp__container' >
                        <input
                            className="chat__inp"
                            type="text"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button onClick={sendMessage} className="send__btn">Отправить</button>
                    </div>
                </main>
            </main>
        </>
    );
}

export default Chat;