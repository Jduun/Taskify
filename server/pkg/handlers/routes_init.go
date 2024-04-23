package handlers

import "github.com/gin-gonic/gin"

func RoutesInit(g *gin.Engine) {
	group := g.Group("/")
	group.POST("/handlers/signup", handleSignUp)
	group.POST("/handlers/signin", handleSignIn)
}
