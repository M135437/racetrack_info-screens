import { useEffect, useState } from "react"
import { socket } from "../../socket/socket"
import { onEvent, emitEvent } from "../../socket/adapter"
import EVENTS from "../../shared/events"

import SessionCard from "../../components/FrontDesk/SessionCard"

export default function FrontDesk() {
    const [sessions, setSessions] = useState([])
    const [newSessionName, setNewSessionName] = useState("")

    useEffect(() => {
        socket.connect()

        // session list request - when the component mounts, ask the server for the current list of sessions
        onEvent(EVENTS.SESSION_LISTED, (data) => {
            console.log("📥 session list:", data)
            setSessions(data)
        })

        onEvent(EVENTS.SESSION_CREATED, (session) => {
            setSessions(prev => [...prev, session])
        })

        onEvent(EVENTS.SESSION_UPDATED, (updated) => {
            setSessions(prev =>
                prev.map(s => s.id === updated.id ? updated : s)
            )
        })

        onEvent(EVENTS.SESSION_DELETED, ({ id }) => {
            setSessions(prev => prev.filter(s => s.id !== id))
        })

        console.log("FrontDesk mounted")

        // session list request - when the component mounts, ask the server for the current list of sessions
        emitEvent(EVENTS.SESSION_GET)

        // session list update - listen for updates to the session list from the server
        onEvent(EVENTS.SESSION_LIST, (data) => {
            console.log("📥 session list:", data)
            setSessions(data)

            setTimeout(() => { //ajutine test, et näha, kas state on ikka õige, kuna tundub, et state ei uuene õigel ajal
                console.log("🧠 state after set:", data)
            }, 100)
        })

        // new session created - listen for confirmation of new session creation and update the list
        onEvent(EVENTS.SESSION_CREATED, (session) => {
            setSessions(prev => [...prev, session])
        })

        // update session - listen for updates to a session (like new driver added or status change) and update the list
        onEvent(EVENTS.SESSION_UPDATED, (updated) => {
            setSessions(prev =>
                prev.map(s => s.id === updated.id ? updated : s)
            )
        })

        // remove session - listen for session deletion and update the list
        onEvent(EVENTS.SESSION_DELETED, ({ id }) => {
            setSessions(prev => prev.filter(s => s.id !== id))
        })

        // error handling - listen for any session-related errors from the server and alert the user
        onEvent(EVENTS.SESSION_ERROR, (err) => {
            alert("Error: " + err)
        })
        console.log("🎨 render sessions:", sessions)
        return () => {
            socket.removeAllListeners()
            socket.disconnect()
        }
    }, [])

    // CREATE
    const createSession = () => {
        if (!newSessionName.trim()) return

        emitEvent(EVENTS.SESSION_CREATE, { name: newSessionName })
        setNewSessionName("")
    }

    // DELETE
    const deleteSession = (id) => {
        if (window.confirm("Delete this session?")) {
            emitEvent(EVENTS.SESSION_DELETE, { id })
        }
    }

    // ADD DRIVER
    const addDriver = (sessionId, driver) => {
        emitEvent(EVENTS.DRIVER_ADD, {
            sessionId,
            driver
        })
    }

    // READY
    const markReady = (id) => {
        emitEvent(EVENTS.SESSION_READY, { id })
    }

    return (
        <div style={{ padding: 20 }}>
            <h1>Front Desk</h1>

            {/* CREATE SESSION */}
            <div style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    placeholder="New session name"
                    value={newSessionName}
                    onChange={(e) => setNewSessionName(e.target.value)}
                />
                <button onClick={createSession}>
                    Create Session
                </button>
            </div>

            {/* SESSION LIST */}
            <div>
                {sessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onDelete={deleteSession}
                        onAddDriver={addDriver}
                        onReady={markReady}
                    />
                ))}
            </div>
        </div>
    )
}



/*import { useEffect, useState } from "react"
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
*/