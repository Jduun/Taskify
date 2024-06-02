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

func getColumnCards(c *gin.Context) {
	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64columnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64columnID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The column does not belong to the user"})
		return
	}

	cards, err := repositories.GetColumnCards(columnID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// make json with column cards
	jsonBase64Cards, err := json.Marshal(cards)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Cards))
}

func createColumnCard(c *gin.Context) {
	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64columnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64columnID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The column does not belong to the user"})
		return
	}

	type CardInfo struct {
		Description string `json:"description"`
		Order       int    `json:"order"`
	}
	var cardInfo CardInfo
	if err := c.BindJSON(&cardInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	card := models.Card{
		ID:          uuid.New().ID(),
		ColumnID:    columnID,
		Description: cardInfo.Description,
		Order:       cardInfo.Order,
	}
	fmt.Println("ColumnID:", columnID)

	if err := repositories.NewCard(card); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	jsonBase64Card, err := json.Marshal(card)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Card))
}

func updateColumnCard(c *gin.Context) {
	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64columnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64columnID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The column does not belong to the user"})
		return
	}

	// get card ID from URL param
	strCardID := c.Param("card_id")
	i64CardID, err := strconv.ParseInt(strCardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cardID := uint32(i64CardID)

	// get new card description from request body
	type CardInfo struct {
		Description string `json:"description"`
	}
	var cardInfo CardInfo
	if err := c.BindJSON(&cardInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// update card
	if err := repositories.UpdateColumnCard(columnID, cardID, cardInfo.Description); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Column " + strColumnID + " updated"})
}

func moveColumnCard(c *gin.Context) {
	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64ColumnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64ColumnID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The column does not belong to the user"})
		return
	}

	// get card ID from URL param
	strCardID := c.Param("card_id")
	i64CardID, err := strconv.ParseInt(strCardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cardID := uint32(i64CardID)

	type MoveInfo struct {
		ColumnID    uint32 `json:"column_id"`
		Description string `json:"description"`
		Order       int    `json:"order"`
	}
	var moveInfo MoveInfo
	if err := c.BindJSON(&moveInfo); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := repositories.MoveColumnCard(columnID, moveInfo.ColumnID, cardID, moveInfo.Description, moveInfo.Order); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Card " + strCardID + " moved"})
}

func deleteColumnCard(c *gin.Context) {
	// get column ID from URL param
	strColumnID := c.Param("column_id")
	i64ColumnID, err := strconv.ParseInt(strColumnID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	columnID := uint32(i64ColumnID)

	// get current user ID
	anyUserID, exists := c.Get("id")
	if !exists {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The token doesn't contain the required claims"})
		return
	}
	// you cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The column does not belong to the user"})
		return
	}

	// get card ID from URL param
	strCardID := c.Param("card_id")
	i64CardID, err := strconv.ParseInt(strCardID, 10, 64)
	if err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	cardID := uint32(i64CardID)

	if err := repositories.DeleteColumnCard(columnID, cardID); err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "Card " + strCardID + " deleted"})
}
