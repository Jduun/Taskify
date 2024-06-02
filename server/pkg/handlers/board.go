package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"net/http"
	"server/pkg/models"
	"server/pkg/repositories"
	"strconv"
)

func createBoard(c *gin.Context) {
	type BoardInfo struct {
		Name string `json:"name"`
	}
	var boardInfo BoardInfo
	if err := c.BindJSON(&boardInfo); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// You cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))
	board := models.Board{
		ID:     uuid.New().ID(),
		UserID: userID,
		Name:   boardInfo.Name,
	}
	if err := repositories.NewBoard(board); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	jsonBase64Board, err := json.MarshalIndent(board, "", "    ")
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Board))
}

func getUserBoards(c *gin.Context) {
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// You cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))
	fmt.Println(userID)
	boards, err := repositories.GetUserBoards(userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	}

	jsonBase64Boards, err := json.Marshal(boards)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Boards))
}

func deleteBoard(c *gin.Context) {
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)
	if err := repositories.DeleteBoard(boardID); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Board " + strBoardID + " deleted"})
}

func updateBoard(c *gin.Context) {
	// get board ID from URL
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)

	// get new board name from request body
	type BoardInfo struct {
		Name string `json:"name"`
	}
	var boardInfo BoardInfo
	if err := c.BindJSON(&boardInfo); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// request to DB to update the name
	if err := repositories.UpdateBoard(boardID, boardInfo.Name); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Board name has been updated"})
}

func getAllBoardInfo(c *gin.Context) {
	// Get board ID from URL param
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the board belongs to the user
	isOwned, err := repositories.IsBoardOwnedByUser(boardID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The board does not belong to the user"})
		return
	}

	// get all board columns
	columns, err := repositories.GetBoardColumns(boardID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// get all cards from board columns
	var cards []models.Card
	for _, column := range columns {
		columnCards, err := repositories.GetColumnCards(column.ID)
		if err != nil {
			c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
			return
		}
		cards = append(cards, columnCards...)
	}

	// make json with board columns
	jsonBase64Columns, err := json.Marshal(columns)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// make json with cards from board columns
	jsonBase64Cards, err := json.Marshal(cards)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"columns": string(jsonBase64Columns), "cards": string(jsonBase64Cards)})
}
