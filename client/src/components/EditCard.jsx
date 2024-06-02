import React, { useState } from "react";
import axios from "axios";
import TextareaAutosize from 'react-textarea-autosize';
import column from "./Column";

const EditCard = ({ editableCard, setEditableCard, setCards }) => {
    const [text, setText] = useState(editableCard.description)

    const handleEditCard = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newCardDescription = e.target.value
            axios.patch(`/api/columns/${editableCard.column_id}/cards/${editableCard.id}`,
                { description: newCardDescription },
                { withCredentials: true }
            )
                .then(response => {
                    editableCard.description = newCardDescription
                    setEditableCard(null)
                    //setColumns(columns => columns.sort((a, b) => a.name.localeCompare(b.name)))
                })
                .catch(error => {
                    console.log("Error:", error)
                })
        } else if (e.key === 'Escape') {
            setEditableCard(null)
        }
    }

    return (
        <div>
            <TextareaAutosize
                onChange={(e) => setText(e.target.value)}
                value={text}
                onBlur={() => { setEditableCard(null) }}
                onKeyDown={(e) => { handleEditCard(e) }}
                maxLength={500}
                autoFocus
                className="w-full rounded border border-violet-400 bg-violet-400/20 p-3 text-sm
                text-neutral-50 placeholder-violet-300 focus:outline-0 resize-none"
            />
        </div>
    )
}

export default EditCard