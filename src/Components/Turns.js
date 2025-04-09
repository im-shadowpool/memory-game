const Turns = ({ turns, turnsTheme }) => {
    return (
        <div className={turnsTheme}>
            <p>Turns: {turns}</p>
        </div>
    )
}

export default Turns;