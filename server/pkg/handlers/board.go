package handlers

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgconn"
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
		// Finding an error with a specific type
		var pgErr *pgconn.PgError
		ok := errors.As(err, &pgErr)
		// Unique key error (23505), which means that a user with the same name already exists
		if ok && pgErr.Code == "23505" {
			c.IndentedJSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
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

func getAllUserBoards(c *gin.Context) {
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// You cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))
	fmt.Println(userID)
	boards, err := repositories.GetAllUserBoards(userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
	}

	jsonBase64Boards, err := json.MarshalIndent(boards, "", "    ")
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Boards))
}

func deleteBoard(c *gin.Context) {
	strBoardID := c.Param("id")
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
	// Get ID from URL
	strBoardID := c.Param("id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)

	// Get new board name from request body
	type BoardInfo struct {
		NewBoardName string `json:"newBoardName"`
	}
	var boardInfo BoardInfo
	if err := c.BindJSON(&boardInfo); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Request to DB to update the name
	if err := repositories.UpdateBoard(boardID, boardInfo.NewBoardName); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Board name has been updated"})
}
