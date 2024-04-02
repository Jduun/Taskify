import React from "react";
import DropIndicator from "./DropIndicator";
import { motion } from "framer-motion";
import TrashIcon from "../icons/TrashIcon";

const Card = ({ title, id, column, handleDragStart, deleteCard }) => {
    return (
        <div>
            <DropIndicator beforeId={id} column={column} />
            <motion.div
                layout
                layoutId={id}
                draggable="true"
                onDragStart={(e) => handleDragStart(e, { title, id, column })}
                className="group relative cursor-grab rounded border border-neutral-700 bg-neutral-800 p-3 active:cursor-grabbing"
            >
                <div>
                    <p className="text-sm text-neutral-100 h-auto whitespace-pre-wrap break-words">
                        {title}
                    </p>
                </div>
                <div>
                    <button
                        onClick={() => {deleteCard(id)}}
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity 
                        duration-150 ease-in-out rounded-md stroke-white p-1 bg-neutral-800 hover:bg-neutral-700"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

export default Card