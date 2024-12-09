import { useCallback, useEffect, useRef, useState } from "react"
import "./Tenzies.css"
import TenziesDie from "./TenziesDie";
import { nanoid } from "nanoid";
import TenziesConfetti from "./TenziesConfetti";

function Tenzies() {

    type Dice = {
        value: number,
        isHeld: boolean,
        id: string
    }

    const [dice, setDice] = useState<Dice[]>(() => generateAllNewDice())
    const [showInstruction, setShowInstruction] = useState<boolean>(false)
    const [second, setSecond] = useState<number>(0);
    const [minute, setMinute] = useState<number>(0);
    const [hour, setHour] = useState<number>(0);
    const [roll, setRoll] = useState(0);

    const buttonRef = useRef<HTMLButtonElement | null>(null)


    const GameWon = useCallback(() => {
        // Check if Game is Over
        const FirsttenzieValue: number = dice[0].value;
        const AllTenzieValue: boolean = dice.every(dice => dice.value === FirsttenzieValue)
        const FirstTenzieHeld: boolean = dice[0].isHeld;
        const AllTenzieHeld: boolean = dice.every(dice => dice.isHeld === FirstTenzieHeld)
        const gameWon = (AllTenzieValue && AllTenzieHeld)
        return gameWon
    }, [dice]);


    useEffect(() => {
        const timer = setInterval(() => {
            setSecond(prevState => prevState + 1);
            if (second === 60) {
                setSecond(0);
                setMinute(prevState => prevState + 1);
            }
            if (minute === 60) {
                setMinute(0)
                setHour(prevState => prevState + 1);
            }

        }, 1000);


        if (GameWon()) {
            buttonRef.current?.focus();
            clearInterval(timer);
        }
        return () => clearInterval(timer)
    }, [GameWon, minute, second])




    function generateAllNewDice() {
        // For randomly getting the values of our button
        const dice: Dice[] = [];
        for (let i = 0; i < 10; i++) {
            const random: Dice = {
                value: Math.ceil(Math.random() * 6),
                isHeld: false,
                id: nanoid()
            }
            dice.push(random)
        }
        return dice;
    }

    function rollDice() {
        // For generating more newDice onclick of roll
        if (GameWon()) {
            setDice(generateAllNewDice());
            setRoll(0);
            setSecond(0);
            setMinute(0);
            setHour(0)
        } else {
            setDice(PrevState => PrevState.map(dice => {
                return dice.isHeld ? dice : ({
                    ...dice,
                    value: Math.ceil(Math.random() * 6)
                })
            }))
            setRoll(prevState => prevState + 1)
        }


    }

    function hold(id: string) {
        // For flipping dice state from held to unheld
        setDice(prevState => prevState.map(dice => {
            return dice.id === id ? ({
                ...dice,
                isHeld: !dice.isHeld
            }) : dice
        }))
    }

    const die = dice.map((dice: Dice) => <TenziesDie key={dice.id} dice={dice} hold={hold} />)
    return (
        <main>
            <div className="main">
                {GameWon() && <TenziesConfetti />}

                <h1>Tenzies</h1>
                <div className="description">
                    {showInstruction && <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls. You win when all dice are the same.</p>}

                    {GameWon() ?
                        (<button onClick={() => setShowInstruction(prevState => !prevState)} className="instruction">You Won!!!</button>)
                        :
                        (<button onClick={() => setShowInstruction(prevState => !prevState)} className="instruction">{showInstruction ? "Hide" : "Show"} Instruction</button>)
                    }
                    {GameWon() &&
                        <p>You rolled
                            <span className="span">{roll}</span> times in
                            <span className="span_p">
                                {hour == 0 ? "" : hour + "hours,"} {minute == 0 ? "" : minute + "minutes,"} {second} seconds
                            </span>
                        </p>}
                </div>
                <div className="dice">
                    {die}
                </div>

                <button ref={buttonRef} onClick={rollDice} className="btn">{GameWon() ? "New Game" : "Roll"}</button>
                <p className="timer">
                    {hour < 10 ? "0" + hour : hour}:
                    {minute < 10 ? "0" + minute : minute}:
                    {second < 10 ? "0" + second : second}
                </p>

                <p className="dev">Okpara Favour &copy; 2024</p>
            </div>

        </main>
    )
}

export default Tenzies;