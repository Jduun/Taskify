import React, { useState } from "react";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';

const EditBoard = ({ editableBoard, setEditableBoard, setBoards }) => {
    const [text, setText] = useState(editableBoard.name)

    const handleEditBoard = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newBoardName = e.target.value
            axios.patch(`/api/boards/${editableBoard.id}`,
                { name: newBoardName },
                { withCredentials: true }
            )
                .then(response => {
                    editableBoard.name = newBoardName
                    setEditableBoard(null)
                    setBoards(boards => boards.sort((a, b) => a.name.localeCompare(b.name)))
                })
                .catch(error => {
                    console.log("Error:", error)
                })
        } else if (e.key === 'Escape') {
            setEditableBoard(null)
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
                className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm
                text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
            />
        </div>
    )
}

export default EditBoard