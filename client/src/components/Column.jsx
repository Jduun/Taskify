import React, { useState } from "react";
import Card from "./Card"
import DropIndicator from "./DropIndicator";
import AddCard from "./AddCard";
import Xmark from "../icons/Xmark";
import axios from "axios";
import EditColumn from "./EditColumn";

const Column = ({ activeBoard, column, setColumns, editableColumn, setEditableColumn, cards, setCards, deleteCard }) => {
    const [active, setActive] = useState(false)

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column.name}"]`))
    }

    const highlightIndicator = (e) => {
        const indicators = getIndicators()
        clearHighlights(indicators)
        const el = getNearestIndicator(e, indicators)
        el.element.style.opacity = "1"
    }

    const clearHighlights = (els) => {
        const indicators = els || getIndicators()
        indicators.forEach((i) => {
            i.style.opacity = "0"
        })
    }

    const getNearestIndicator = (e, indicators) => {
        const DISTANCE_OFFSET = 50;
        const el = indicators.reduce(
            (closest, child) => {
                const box = child.getBoundingClientRect();

                const offset = e.clientY - (box.top + DISTANCE_OFFSET);

                if (offset < 0 && offset > closest.offset) {
                    return { offset: offset, element: child };
                } else {
                    return closest;
                }
            },
            {
                offset: Number.NEGATIVE_INFINITY,
                element: indicators[indicators.length - 1],
            }
        );

        return el;
    }

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardId", card.id)
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        highlightIndicator(e)
        setActive(true)
    }

    const handleDragLeave = () => {
        setActive(false)
        clearHighlights()
    }

    const handleDrop = (e) => {
        setActive(false)
        clearHighlights()

        const cardId = e.dataTransfer.getData("cardId")
        const indicators = getIndicators()
        const { element } = getNearestIndicator(e, indicators)
        const before = element.dataset.before || "-1"

        if (before !== cardId) {
            let copy = [...cards]
            let cardToTransfer = copy.find((c) => c.id === cardId)
            if (!cardToTransfer) {
                return
            }
            cardToTransfer = { ...cardToTransfer, column }
            copy = copy.filter((c) => c.id !== cardId)

            const moveToBack = before === "-1"
            if (moveToBack) {
                copy.push(cardToTransfer)
            }
            else {
                const insertAtIndex = copy.findIndex((el) => el.id === before)
                if (insertAtIndex === undefined) {
                    return
                }

                copy.splice(insertAtIndex, 0, cardToTransfer)
            }
            setCards(copy)
        }
    }

    const filteredCards = cards.filter((card) => card.column === column)
    const [isHovering, setIsHovering] = useState(false)

    const handleDeleteColumn = (column) => {
        console.log("Delete the column", column)
        axios.delete(`/api/boards/${activeBoard.id}/columns/${column.id}`, { withCredentials: true })
            .then(response => {
                console.log("Column successfully deleted", response)
                setColumns(columns => columns.filter(currColumn => currColumn.id !== column.id))
            })
            .catch(error => {
                console.log("Error:", error)
            })
    }

    return (
        <div className="flex flex-col w-56 shrink-0">
            {editableColumn !== column ? (
                <div onDoubleClick={() => { setEditableColumn(column) }}
                     onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}
                     className="flex items-baseline">
                    <h3 className="w-[90%] font-medium text-textColor whitespace-pre-wrap break-words select-none">{column.name}</h3>
                    <button
                        className={`ml-2 rounded-full hover:bg-mainColor-300 opacity-${isHovering ? "100" : "0"}`}
                        onClick={() => handleDeleteColumn(column)}
                    >
                        <Xmark/>
                    </button>
                </div> ) : (
                <div>
                    <EditColumn
                        activeBoard={activeBoard}
                        editableColumn={editableColumn}
                        setEditableColumn={setEditableColumn}
                        setColumns={setColumns}
                    />
                </div>
                )
            }
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-grow w-full overflow-y-scroll transition-colors ${active ? "bg-neutral-800/50" : "bg-neutral-800/0"}`}
            >
                {filteredCards.map((card) => {
                    return <Card key={card.id} {...card} handleDragStart={handleDragStart} deleteCard={deleteCard} />
                })}
                <DropIndicator beforeId={"-1"} column={column} />
                <AddCard column={column} setCards={setCards} />
            </div>
        </div>
    )
}

export default Column