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

func createBoardColumn(c *gin.Context) {
	// get board ID from URL param
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)
	fmt.Println(boardID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// You cannot immediately cast any to uint32
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

	type ColumnInfo struct {
		Name  string `json:"name"`
		Order int    `json:"order"`
	}
	var columnInfo ColumnInfo
	if err := c.BindJSON(&columnInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	column := models.Column{
		ID:      uuid.New().ID(),
		BoardID: boardID,
		Name:    columnInfo.Name,
		Order:   columnInfo.Order,
	}

	if err := repositories.NewColumn(column); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	jsonBase64Column, err := json.Marshal(column)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Column))
}

func getBoardColumns(c *gin.Context) {
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
	}

	// make json with board columns
	jsonBase64Columns, err := json.Marshal(columns)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Columns))
}

func updateBoardColumn(c *gin.Context) {
	// get board ID from URL param
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)
	fmt.Println(boardID)

	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64columnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64columnID)
	fmt.Println(columnID)

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

	// get new column name from request body
	type ColumnInfo struct {
		Name string `json:"name"`
	}
	var columnInfo ColumnInfo
	if err := c.BindJSON(&columnInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Println("newColName", columnInfo.Name)

	// update column
	if err := repositories.UpdateBoardColumn(boardID, columnID, columnInfo.Name); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Column " + strColumnID + " updated"})
}

func deleteBoardColumn(c *gin.Context) {
	// get board ID from URL param
	strBoardID := c.Param("board_id")
	i64boardID, err := strconv.ParseInt(strBoardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	boardID := uint32(i64boardID)
	fmt.Println(boardID)

	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64columnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64columnID)
	fmt.Println(columnID)

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

	// delete column
	if err := repositories.DeleteBoardColumn(boardID, columnID); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Column " + strColumnID + " deleted"})
}
