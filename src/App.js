import React from "react"
import Die from "./Die"
import { nanoid } from "nanoid"
import Confetti from "./Confetti"

export default function App() {

    const [diceArray, setDiceArray] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [numRolls, setNumRolls] = React.useState(1)
    const [timer, setTimer] = React.useState(0)

    React.useEffect(() => {
        let isWinner = true
        let i = 0
        while (isWinner && i < diceArray.length) {
            if (diceArray[i].value != diceArray[0].value) {
                isWinner = false
            }
            else if (diceArray[i].isHeld === false) {
                isWinner = false
            }
            i++
        }

        if (isWinner) {
            console.log("YOU WON")
            setTenzies(true)
            setTimer(0)
        }

    }, [diceArray])

    function allNewDice() {
        const newArray = []
        for (let i = 0; i < 10; i++) {
            newArray.push(generateNewDie())
        }
        return newArray
    }

    function generateNewDie() {
        const random = Math.floor(Math.random() * 6) + 1
        const newDice = { value: random, isHeld: false, id: nanoid(), diceClick: diceClick }
        return newDice
    }

    function handleRoll() {
        if (!tenzies) {
            setNumRolls(prevNumRolls => prevNumRolls + 1)
            setDiceArray(prevDiceArray => prevDiceArray.map(die => {
                return die.isHeld ?
                    die :
                    generateNewDie()
            }))
        } else {
            setNumRolls(1)
            setDiceArray(allNewDice())
            setTenzies(false)
        }
    }

    function diceClick(id) {
        setDiceArray(prevDiceArray => prevDiceArray.map(die => {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } : die
        }))
    }

    function updateTimer() {
        setTimer(prevTimer => prevTimer + 1)

    }

    React.useEffect(() => {
        setInterval(updateTimer, 1000)
    }, [])

    const diceElements = diceArray.map(die => <Die
        key={die.id}
        value={die.value}
        isHeld={die.isHeld}
        diceClick={() => diceClick(die.id)} />)

    return (
        <main className="main">
            {tenzies && <Confetti />}
            <div className="main-box">
                <h1 className="title">Tenzies</h1>
                <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
                <div className="dice-container">
                    {diceElements}
                </div>
                <div className="roll-info">
                    <button className="roll-btn" onClick={handleRoll}>{tenzies ? "New Game" : "Roll"}</button>
                    <div className="roll-data">
                        <h2 className="num-rolls">Rolls: {numRolls}</h2>
                        <h2>Time: {timer}</h2>
                    </div>
                </div>
            </div>
        </main>
    )
}