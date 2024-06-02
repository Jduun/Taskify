import React, { useState, useEffect } from "react";
import Card from "./Card"
import DropIndicator from "./DropIndicator";
import AddCard from "./AddCard";
import Xmark from "../icons/Xmark";
import axios from "axios";
import EditColumn from "./EditColumn";

const Column = ({ activeBoard, column, columns, setColumns, editableColumn, setEditableColumn, cards, setCards }) => {
    const [active, setActive] = useState(false)
    const [columnCards, setColumnCards] = useState([])
    const [isHovering, setIsHovering] = useState(false)

    const getIndicators = () => {
        return Array.from(document.querySelectorAll(`[data-column="${column.id}"]`));
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
        // console.log("Indicators:", indicators)
        // console.log("Nearest:", el)
        return el;
    }

    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("cardID", card.id)
        console.log("Handle Drag Start: ", card.id)
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

        const cardID = parseInt(e.dataTransfer.getData("cardID"), 10)
        console.log("CARDID:", cardID)
        const indicators = getIndicators()
        const { element } = getNearestIndicator(e, indicators)
        const before = parseInt(element.dataset.before, 10) || -1

        //const columnID = column.id
        if (before !== cardID) {

            let copy = [...cards]
            console.log("CARD LIST: ", cards)
            console.log("COPY LIST: ", copy, cardID)
            copy.map((c) => {
                console.log("TEST: ", c.id, cardID, c.id === cardID, typeof c.id, typeof cardID)
            })
            let cardToTransfer = copy.find((c) => c.id === cardID)

            console.log("Card to transfer: ", cardToTransfer, cardID)
            if (!cardToTransfer) {
                return
            }
            //copy = copy.filter((c) => c.id !== cardID)


            const oldColumnID = cardToTransfer.column_id
            const newColumnID = column.id
            // cardToTransfer.column_id = newColumnID

            /*
            if (moveToBack) {
                //cardToTransfer.column_id = column.id
                copy.push(cardToTransfer)
            } else {
                const insertAtIndex = copy.findIndex((el) => el.id === before)
                if (insertAtIndex === undefined) {
                    return
                }
                //cardToTransfer.column_id = copy.find((c) => c.id === before).column_id
                //cardToTransfer.column_id = column.id
                copy.splice(insertAtIndex, 0, cardToTransfer)
            }
             */

            let order = null
            const moveToBack = before === -1
            if (moveToBack) {
                // handle the insertion in the same place
                if (oldColumnID === newColumnID) {
                    return
                }
                const count = cards.filter(card => card.column_id === newColumnID).length
                setCards(cards => cards.map(card => {
                    if (card.id === cardToTransfer.id) {
                        order = count
                        return { ...card, order: order, column_id: newColumnID }
                    }
                    return card
                }))
            } else {
                const cardBefore = cards.find(card => card.id === before)
                // handle the insertion in the same place
                if (oldColumnID === newColumnID &&
                    (cardToTransfer.order === cardBefore.order - 1 || cardToTransfer.order === cardBefore.order)) {
                    return
                }
                setCards(cards => cards.map(card => {
                    if (card.id === cardToTransfer.id) {
                        //console.log("WORK x:", { ...card, order: cardBefore.order, column_id: newColumnID })
                        order = cardBefore.order
                        return { ...card, order: order, column_id: newColumnID }
                    }
                    if (card.column_id === newColumnID && card.order >= cardBefore.order) {
                        //console.log("WORK + 1:", { ...card, order: card.order + 1 })
                        //order = card.order + 1
                        return { ...card, order: card.order + 1 }
                    }
                    if (card.column_id === oldColumnID && card.order >= cardToTransfer.order) {
                        //console.log("WORK - 1:", { ...card, order: card.order - 1 })
                        //order = card.order - 1
                        return { ...card, order: card.order - 1 }
                    }
                    return card
                }))
            }
            console.log("HANDLE DROP: ", cards, oldColumnID, newColumnID)

            if (order !== null) {
                axios.post(`/api/columns/${oldColumnID}/cards/${cardID}/move`,
                    {"column_id": column.id, "description": cardToTransfer.description, "order": order},
                    {withCredentials: true})
                    .then(response => {
                        console.log("Move card response: ", response)
                        console.log("[CARD order", order)
                    })
                    .catch(error => {
                        console.log("Error:", error)
                    })
            }
        }
    }

    const handleDeleteColumn = (column) => {
        console.log("Delete the column", column)
        axios.delete(`/api/boards/${activeBoard.id}/columns/${column.id}`, { withCredentials: true })
            .then(response => {
                console.log("Column successfully deleted", response)
                setColumns(columns =>
                    columns.filter(currColumn => currColumn.id !== column.id)
                        .map(currColumn => {
                            if (currColumn.order > column.order) {
                                return { ...currColumn, order: currColumn.order - 1 };
                            }
                            return currColumn;
                        }
                    )
                )
                console.log("COLUMNS: ", columns)
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
                    <h3 className="w-[90%] font-medium text-textColor whitespace-pre-wrap break-words select-none">{column.name} [{column.id}]</h3>
                    <button
                        className={`ml-2 rounded-full hover:bg-mainColor-300 opacity-${isHovering ? "100" : "0"}`}
                        onClick={() => handleDeleteColumn(column)}
                    >
                        <Xmark/>
                    </button>
                </div> ) : (
                <div>
                    <EditColumn
                        activeBoard={ activeBoard }
                        editableColumn={ editableColumn }
                        setEditableColumn={ setEditableColumn }
                        setColumns={ setColumns }
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
                {
                    cards.filter((card) => (card !== undefined && card.column_id === column.id))
                        .sort((a, b) => a.order - b.order)
                        .map((card) => {
                        console.log("Rendering Card:", card);
                        return (
                            <Card
                                key={ card.id }
                                card={ card }
                                setCards={ setCards }
                                handleDragStart={ handleDragStart }
                            />
                        );
                    })
                }
                <DropIndicator
                    beforeID={-1}
                    columnID={column.id}
                />
                <AddCard
                    columnID={column.id}
                    cards={cards}
                    setCards={setCards} />
            </div>
        </div>
    )
}

export default Column