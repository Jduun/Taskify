import React, {useState, useEffect, createFactory} from "react";
import Column from "./Column";
import AddColumn from "./AddColumn";
import axios from "axios";
import column from "./Column";

const Board = ({ activeBoard }) => {
    const [columns, setColumns] = useState([])
    const [cards, setCards] = useState([{"id": 1, "description": "my card", "column_id": 3472668434, "order": 0}])
    const [labels, setLabels] = useState([])
    const [cardLabels, setCardLabels] = useState([])
    const [editableColumn, setEditableColumn] = useState(null)

    useEffect(() => {
        if (activeBoard !== null) {
            console.log("ACTIVE:", activeBoard, activeBoard !== [])
            axios.get(`/api/boards/${activeBoard.id}`, {withCredentials: true})
                .then(response => {
                    // handle columns data
                    const jsonStringColumns = response.data.columns
                    const jsonColumns = JSON.parse(jsonStringColumns)
                    console.log("Columns: ", jsonColumns)
                    setColumns(jsonColumns === null ? [] : jsonColumns)

                    // handle cards data
                    const jsonStringCards = response.data.cards
                    const jsonCards = JSON.parse(jsonStringCards)
                    console.log("Cards: ", jsonCards)
                    setCards(jsonCards === null ? [] : jsonCards)
                })
                .catch(error => console.log("Error:", error))
        }
    }, [activeBoard]);

    useEffect(() => {
        console.log(cards)
    }, [activeBoard])

    useEffect(() => {
        console.log("[CARDS]:", cards)
    }, [cards])

    return (
        <div className="flex w-full gap-3 p-3 overflow-y-scroll">
            {
                activeBoard !== null ? (
                    <>
                        <div>
                            <input type="color" />
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
                                />
                                )
                            )
                        }
                        <AddColumn
                            columns={ columns }
                            setColumns={ setColumns }
                            activeBoard={ activeBoard }
                        />
                    </>) : (
                    <>
                    </>
                )
            }
        </div>
    )
}

export default Board