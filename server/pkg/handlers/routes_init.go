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
		authGroup.POST("/boards", createBoard)
		authGroup.GET("/boards", getAllUserBoards)
		authGroup.DELETE("/boards/:id", deleteBoard)
		authGroup.PUT("/boards/:id", updateBoard)
	}
}
