import { useEffect, useState } from "react"
import { socket } from "../../socket/socket";
import EVENTS from "../../shared/events";
import "./FrontDesk.css";


// This page is for managing sessions (creating/deleting) and viewing upcoming sessions. It is a simple interface that emits socket events to the server and listens for updates.
export default function FrontDesk() {
    const [sessions, setSessions] = useState([]) //
    const [name, setName] = useState("") // for creating session

    const [loading, setLoading] = useState(true) // ✅ ДОБАВЛЕНО: состояние загрузки
    const [error, setError] = useState(null) // ✅ ДОБАВЛЕНО: состояние ошибки

    useEffect(() => { // on component mount, request the list of upcoming sessions from the server


        socket.emit(EVENTS.SESSION_GET)

        const handler = (data) => {
            console.log("✅ GOT DATA:", data)
            setSessions(data)
            setLoading(false)
        }

        socket.on(EVENTS.SESSION_LISTED, handler)

        return () => {
            socket.off(EVENTS.SESSION_LISTED, handler) // 🔥 ВАЖНО
        }
    }, [])


    const createSession = () => { // emit event to create a new session with the given name, after validating that the name is not empty
        if (!name.trim()) return // simple validation to prevent creating sessions with empty names

        socket.emit("session:create", { name }) // emit event to create session with the name from state

        setName("") // clear the input field after creating the session
    }

    const deleteSession = (id) => { // emit event to delete a session by its id
        socket.emit("session:delete", { id }) // emit event to delete session with the given id

    }

    return ( // render the UI for managing sessions, including an input field for creating sessions and a list of existing sessions with delete buttons
        <div className="container">
            <h1>Front Desk</h1>

            {/* ✅ ДОБАВЛЕНО: отображение loading */}
            {loading && <p>Loading sessions...</p>}

            {/* ✅ ДОБАВЛЕНО: отображение ошибки */}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}

            <div className="create">
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Session name"
                />
                <button
                    onClick={createSession}
                    disabled={!name.trim()} // ✅ ДОБАВЛЕНО: защита от пустого ввода
                >
                    Create
                </button>
            </div>

            <div className="sessions">
                {sessions.map(s => ( // render each session as a card with its name and a delete button
                    <div key={s.id} className="card">
                        <span>{s.name}</span>
                        <button onClick={() => deleteSession(s.id)}>
                            Delete
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}