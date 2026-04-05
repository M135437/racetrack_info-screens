import { useEffect, useState } from "react"
import { socket } from "../../socket/socket.js"

export default function FrontDesk() {
    const [sessions, setSessions] = useState([])
    const [newSessionName, setNewSessionName] = useState("")

    //Connect listeners
    useEffect(() => {
        // Ask the server for the current list of sessions when the component mounts
        socket.emit("session:get")

        // Listen for updates to the session list
        socket.on("session:list", (data) => {
            setSessions(data)
        })

        //Error handling
        socket.on("session:error", (error) => {
            alert("Error: " + error)
        })

        // Clean up listeners when the component unmounts
        return () => {
            socket.off("session:list")
            socket.off("session:error")
        }
    }, [])


    //Create session function    
    const createSession = () => {
        if (newSessionName.trim() === "") {
            alert("Please enter a session name.")
            return
        }
        socket.emit("session:create", { name: newSessionName })
        setNewSessionName("")
    }

    //Delete session function
    const deleteSession = (sessionId) => {
        if (window.confirm("Are you sure you want to delete this session?")) {
            socket.emit("session:delete", sessionId)
        }
    }

    return (
        <div className="frontdesk">
            <h1>Front Desk</h1>

            <div className="create-session">
                <input
                    type="text"
                    placeholder="New session name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                />
                <button onClick={createSession}>Create Session</button>
            </div>

            <ul>
                {sessions.map((session) => (
                    <li key={session.id}>
                        <strong>{session.name}</strong>

                        <button onClick={() => deleteSession(session.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
