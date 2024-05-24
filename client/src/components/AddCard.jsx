import React, { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import TextareaAutosize from 'react-textarea-autosize';

const AddCard = ({ columnID, setCards }) => {
    const [text, setText] = useState("")
    const [adding, setAdding] = useState(false)

    const handleAddCard = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const cardDescription = text.trim()
            if (!cardDescription.length) {
                return
            }
            const newCard = {
                columnID: columnID,
                description: cardDescription,
                id: Math.floor(Math.random() * 100000000).toString()
            }
            setCards((cards) => [...cards, newCard])
            setAdding(false)
        } else if (e.key === 'Escape') {
            setAdding(false)
        }
    }

    return (
        <div>
            {adding ? (
                <TextareaAutosize
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {handleAddCard(e)}}
                    maxLength={500}
                    autoFocus
                    onBlur={() => setAdding(false)}
                    placeholder="Add new card..."
                    className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
                />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span>Add card</span>
                    <PlusIcon />
                </button>
            )
            }
        </div>
    )
}

export default AddCard