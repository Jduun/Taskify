import React, { useState } from "react";
import DropIndicator from "./DropIndicator";
import TrashIcon from "../icons/TrashIcon";
import axios from "axios";
import PencilIcon from "../icons/PencilIcon";
import EditCard from "./EditCard";

const Card = ({ card, setCards, handleDragStart }) => {
    const [editableCard, setEditableCard] = useState(null)

    const deleteCard = () => {
        axios.delete(`/api/columns/${card.column_id}/cards/${card.id}`, { withCredentials: true })
            .then(response => {
                console.log("Card successfully deleted", response)
                setCards(cards =>
                    cards.filter(currCard => currCard.id !== card.id)
                        .map(currCard => {
                            if (currCard.column_id === card.column_id && currCard.order > card.order) {
                                return { ...currCard, order: currCard.order - 1 }
                            }
                            return currCard
                        })
                )
            })
            .catch(error => {
                console.log("Error:", error)
            })
    }

    return (
        <div>
            <DropIndicator
                beforeID={card.id}
                columnID={card.column_id}
            />
            {editableCard === null ? (
                <div
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, card)}
                    className="group relative cursor-grab rounded border-2 border-white hover:border-extraColor bg-mainColor-700 p-3 active:cursor-grabbing"
                >
                    <div>
                        <p className="text-sm text-textColor h-auto whitespace-pre-wrap break-words select-none">
                            {card.description}[{card.id}, {card.column_id}]
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                deleteCard()
                            }}
                            className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                            duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-700 hover:bg-mainColor-300"
                        >
                            <TrashIcon />
                        </button>
                    </div>
                    <div>
                        <button
                            onClick={() => {
                                setEditableCard(card)
                            }}
                            className="absolute right-9 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                            duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-700 hover:bg-mainColor-300"
                        >
                            <PencilIcon />
                        </button>
                    </div>
                </div> ) : (
                <div>
                    <EditCard
                        editableCard={ editableCard }
                        setEditableCard={ setEditableCard }
                        setCards={ setCards }
                    />
                </div>
            )}

        </div>
    )
}

export default Card