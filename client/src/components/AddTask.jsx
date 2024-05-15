import React, { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import Xmark from "../icons/Xmark";
import TextareaAutosize from 'react-textarea-autosize';

const AddTask = ({ column, setCards }) => {
    const [text, setText] = useState("")
    const [adding, setAdding] = useState(false)

    const handleAddTask = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()

            if (!text.trim().length) {
                return
            }
            const newCard = {
                column,
                title: text.trim(),
                id: Math.random().toString()
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
                    onKeyDown={(e) => {handleAddTask(e)}}
                    maxLength={500}
                    autoFocus
                    onBlur={() => setAdding(false)}
                    placeholder="Add new task..."
                    className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
                />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span>Add task</span>
                    <PlusIcon />
                </button>
            )
            }
        </div>
    )
}

export default AddTask