type Dice = {
    value: number;
    isHeld: boolean,
    id: string
}

function TenziesDie({ dice, hold }: { dice: Dice, hold: (value: string) => void }) {

    const styles = {
        // If dice is held
        background: dice.isHeld ? "#59E391" : "",
        borderColor: dice.isHeld ? "#59E391" : "",
    }

    return (
        <button style={styles} onClick={() => hold(dice.id)} className="dice-parts">
            {dice.value}
        </button>
    )
}

export default TenziesDie