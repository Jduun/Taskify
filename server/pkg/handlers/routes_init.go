package handlers

import "github.com/gin-gonic/gin"

func RoutesInit(g *gin.Engine) {
	group := g.Group("/")
	group.GET("/api/checkToken", checkToken)
	group.POST("/api/signUp", handleSignUp)
	group.POST("/api/signIn", handleSignIn)
	group.POST("/api/signOut", handleSignOut)
}
