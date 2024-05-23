import React, { useState } from "react";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import column from "./Column";

const EditColumn = ({ activeBoard, editableColumn, setEditableColumn, setColumns }) => {
    const [text, setText] = useState(editableColumn.name)

    const handleEditColumn = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newColumnName = e.target.value
            axios.patch(`/api/boards/${activeBoard.id}/columns/${editableColumn.id}`,
                { name: newColumnName },
                { withCredentials: true }
            )
                .then(response => {
                    editableColumn.name = newColumnName
                    setEditableColumn(null)
                    //setColumns(columns => columns.sort((a, b) => a.name.localeCompare(b.name)))
                })
                .catch(error => {
                    console.log("Error:", error)
                })
        } else if (e.key === 'Escape') {
            setEditableColumn(null)
        }
    }

    return (
        <div>
            <TextareaAutosize
                onChange={(e) => setText(e.target.value)}
                value={text}
                onBlur={() => { setEditableColumn(null) }}
                onKeyDown={(e) => {handleEditColumn(e)}}
                maxLength={100}
                autoFocus
                className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm
                text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
            />
        </div>
    )
}

export default EditColumn