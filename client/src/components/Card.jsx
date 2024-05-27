import React from "react";
import DropIndicator from "./DropIndicator";
import TrashIcon from "../icons/TrashIcon";
import column from "./Column";

const Card = ({ card, handleDragStart, deleteCard }) => {
    return (
        <div>
            <DropIndicator
                beforeID={card.id}
                columnID={card.column_id}
            />
            <div
                draggable="true"
                onDragStart={(e) => handleDragStart(e, card)}
                className="group relative cursor-grab rounded border-2 border-white hover:border-extraColor bg-mainColor-700 p-3 active:cursor-grabbing"
            >
                <div>
                    <p className="text-sm text-textColor h-auto whitespace-pre-wrap break-words select-none">
                        { card.description }[{ card.id }, { card.column_id }]
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => { deleteCard(card.id) }}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity
                        duration-150 ease-in-out rounded-md stroke-white p-1 bg-mainColor-700 hover:bg-mainColor-300"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Card