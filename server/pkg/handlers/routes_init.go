package handlers

import "github.com/gin-gonic/gin"

func RoutesInit(g *gin.Engine) {
	group := g.Group("/")
	group.POST("/api/signup", handleSignUp)
	group.POST("/api/signin", handleSignIn)
}
