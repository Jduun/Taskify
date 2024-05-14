import React, { useState } from "react";
import PlusIcon from "../icons/PlusIcon";
import Xmark from "../icons/Xmark";
import axios from "axios";
import {json} from "react-router-dom";
import {string} from "yup";
import TextareaAutosize from 'react-textarea-autosize';

const EditBoard = ({ editableBoard, setEditableBoard }) => {
    const [text, setText] = useState(editableBoard.name)

    const handleEditBoard = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const newBoardName = e.target.value
            axios.put(`/api/boards/${editableBoard.id}`,
                { newBoardName: newBoardName },
                { withCredentials: true }
            )
                .then(response => {
                    editableBoard.name = newBoardName
                    setEditableBoard(null)
                })
                .catch(error => {
                    console.log("Error:", error)
                })
        }
    }

    return (
        <div>
            <TextareaAutosize
                onChange={(e) => setText(e.target.value)}
                value={text}
                onBlur={() => { setEditableBoard(null) }}
                onKeyDown={(e) => {handleEditBoard(e)}}
                maxLength={100}
                autoFocus
                className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
            />
        </div>
    )
}

export default EditBoard