import React, { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import Xmark from "../icons/Xmark";
import axios from "axios";
import {json} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';

const AddBoard = ({ setBoardList }) => {
    const [text, setText] = useState("")
    const [adding, setAdding] = useState(false)

    const handleAddBoard = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const boardName = text.trim()
            if (!boardName.length) {
                return
            }
            axios.post('/api/boards',
                {"name": boardName},
                {withCredentials: true})
                .then(response => {
                    console.log("Create board response: ", response)
                    const jsonStringBoard = response.data
                    const jsonBoard = JSON.parse(jsonStringBoard)
                    if (jsonBoard !== null) {
                        console.log(jsonBoard)
                        setBoardList(boardList => [...boardList, jsonBoard])
                        setAdding(false)
                    }
                })
                .catch(error => {
                    console.log("Error:", error)
                })
        } else if (e.key === 'Escape') {
            setAdding(false)
        }
    }

    return (
        <div>
            {adding ? (
                <TextareaAutosize
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {handleAddBoard(e)}}
                    maxLength={100}
                    autoFocus
                    onBlur={() => setAdding(false)}
                    placeholder="Add new board..."
                    className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm
                    text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
                />
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400
                     transition-colors hover:text-neutral-50"
                >
                    <span className="text-base"><strong>Add board</strong></span>
                    <PlusIcon />
                </button>
            )}
        </div>
    )
}

export default AddBoard