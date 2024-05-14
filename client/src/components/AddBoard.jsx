import React, { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import Xmark from "../icons/Xmark";
import axios from "axios";
import {json} from "react-router-dom";
import TextareaAutosize from 'react-textarea-autosize';

const AddBoard = ({ setBoardList }) => {
    const [text, setText] = useState("")
    const [adding, setAdding] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        const boardName = text.trim()

        if (!boardName.length) {
            return
        }

        axios.post('/api/boards', { "name": boardName }, { withCredentials: true })
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
    }

    return (
        <div>
            {adding ? (
                <form onSubmit={handleSubmit}>
                    <TextareaAutosize
                        onChange={(e) => setText(e.target.value)}
                        maxLength={100}
                        autoFocus
                        placeholder="Add new board..."
                        className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
                    />
                    <div className="mt-1.5 flex items-center justify-start gap-1.5">
                        <button
                            type="submit"
                            className="flex items-center gap-1.5 rounded bg-neutral-50 px-3 py-1.5 text-xs text-neutral-950 transition-colors hover:bg-neutral-300">
                            Add
                        </button>
                        <button
                            onClick={() => setAdding(false)}
                            className="px-2 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                        >
                            <Xmark />
                        </button>
                    </div>

                </form>
            ) : (
                <button
                    onClick={() => setAdding(true)}
                    className="flex w-full items-center gap-1.5 px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:text-neutral-50"
                >
                    <span className="text-base"><strong>Add board</strong></span>
                    <PlusIcon />
                </button>
            )
            }
        </div>
    )
}

export default AddBoard