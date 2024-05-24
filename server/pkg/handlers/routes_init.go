package handlers

import "github.com/gin-gonic/gin"

func RoutesInit(g *gin.Engine) {
	freeGroup := g.Group("/api")
	{
		freeGroup.GET("/checkToken", checkToken)
		freeGroup.POST("/signUp", signUp)
		freeGroup.POST("/signIn", signIn)
		freeGroup.POST("/signOut", signOut)
	}

	authGroup := g.Group("/api").Use(authMiddleware())
	{
		// сделать проверку - принадлежит ли доска пользователю (или добавить user id в запросы)
		authGroup.POST("/boards", createBoard)
		authGroup.GET("/boards", getUserBoards)
		authGroup.PATCH("/boards/:board_id", updateBoard)
		authGroup.DELETE("/boards/:board_id", deleteBoard)
		authGroup.GET("/boards/:board_id", getAllBoardInfo)

		authGroup.GET("/boards/:board_id/columns", getBoardColumns)
		authGroup.POST("/boards/:board_id/columns", createBoardColumn)
		authGroup.PATCH("/boards/:board_id/columns/:column_id", updateBoardColumn)
		authGroup.DELETE("/boards/:board_id/columns/:column_id", deleteBoardColumn)

		// сделать триггер после удаления карточки (реордеринг)
		// сделать реордеринг при переносах (и смену столбца при необходимости)
		authGroup.GET("/columns/:column_id/cards", getColumnCards)
		authGroup.POST("/columns/:column_id/cards", createColumnCard)
		authGroup.PATCH("/columns/:column_id/cards/:card_id", updateColumnCard)
		authGroup.DELETE("/columns/:column_id/cards/:card_id", deleteColumnCard)

		authGroup.GET("/boards/:board_id/labels", getBoardLabels)
		authGroup.POST("/boards/:board_id/labels", createBoardLabel)
		authGroup.PATCH("/boards/:board_id/labels/:label_id", updateBoardLabel)
		authGroup.DELETE("/boards/:board_id/labels/:label_id", deleteBoardLabel)
	}
}
