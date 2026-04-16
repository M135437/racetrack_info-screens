import { Link } from "react-router-dom";

function AuthorizationScreen({ roleName, handleLogin, inputKey, setInputKey, error }) {
    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
        <h2>{roleName} - authorised access only!</h2>
        <p>Please provide passcode:</p>
        <form onSubmit={handleLogin}>
            <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
            />
            <button type="submit">Enter</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Link to="/">Home</Link>
    </div>
    );
}

export default AuthorizationScreen;