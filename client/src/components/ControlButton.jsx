function ControlButton({buttonName,onClick}) {
    return <div className="controlbutton">
        <button onClick={onClick}>{buttonName}</button>
    </div>;
}

export default ControlButton;