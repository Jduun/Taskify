package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"net/http"
	"server/pkg/repositories"
	"strconv"
)

func getColumnCards(c *gin.Context) {
	// Get column ID from URL param
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
	// You cannot immediately cast any to uint32
	userID := uint32(anyUserID.(float64))

	// check whether the column belongs to the user
	isOwned, err := repositories.IsColumnOwnedByUser(columnID, userID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !isOwned {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": "The board does not belong to the user"})
		return
	}

	cards, err := repositories.GetColumnCards(columnID)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	// Make json with column cards
	jsonBase64Cards, err := json.Marshal(cards)
	if err != nil {
		fmt.Println("Error marshalling JSON:", err)
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"message": err.Error()})
		return
	}

	c.IndentedJSON(http.StatusOK, string(jsonBase64Cards))
}

func createColumnCard(c *gin.Context) {

}

func updateColumnCard(c *gin.Context) {

}

func deleteColumnCard(c *gin.Context) {

}
