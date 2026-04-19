import { Link } from "react-router-dom";

function AuthorizationScreen({ roleName, handleLogin, inputKey, setInputKey, error }) {
    return (
        <div className="auth-container">
            <div className="auth-header">
            <h1>{roleName}</h1>
            <h2>Authorised access only!</h2>
            </div>
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
            <div className="auth-footer">
                <Link to="/">Home</Link>
        </div>
    </div>
    );
}

export default AuthorizationScreen;