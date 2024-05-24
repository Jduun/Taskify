import React, {useState, useEffect, createFactory} from "react";
import Column from "./Column";
import AddColumn from "./AddColumn";
import axios from "axios";
import column from "./Column";

const Board = ({ activeBoard }) => {
    const [columns, setColumns] = useState([])
    const [cards, setCards] = useState([])
    const [labels, setLabels] = useState([])
    const [cardLabels, setCardLabels] = useState([])
    const [editableColumn, setEditableColumn] = useState(null)

    useEffect(() => {
        if (activeBoard !== null) {
            console.log("ACTIVE:", activeBoard, activeBoard !== [])
            axios.get(`/api/boards/${activeBoard.id}/columns`, {withCredentials: true})
                .then(response => {
                    const jsonStringColumns = response.data
                    const jsonColumns = JSON.parse(jsonStringColumns)
                    console.log("Columns: ", jsonColumns)
                    setColumns(jsonColumns === null ? [] : jsonColumns)
                })
                .catch(error => console.log("Error:", error))
        }
    }, [activeBoard]);

    useEffect(() => {
        console.log(cards)
    }, [cards])

    const deleteCard = (cardId) => {
        setCards(cards.filter((c) => c.id !== cardId))
    }

    return (
        <div className="flex w-full gap-3 p-3 overflow-y-scroll">
            <div>
                <input type="color"/>
            </div>
            {
                columns.map((column) => (
                    <Column
                        key={ column.id }
                        activeBoard={ activeBoard }
                        column={ column }
                        columns={ columns }
                        setColumns={ setColumns }
                        editableColumn={ editableColumn }
                        setEditableColumn={ setEditableColumn }
                        cards={ cards }
                        setCards={ setCards }
                        deleteCard={deleteCard}
                    />
                    )
                )
            }
            <AddColumn
                columns={ columns }
                setColumns={ setColumns }
                activeBoard={ activeBoard }
            />
        </div>
    )
}

export default Board