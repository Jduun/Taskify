package handlers

import (
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"net/http"
	"server/pkg/utils"
)

func authMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		cookie, err := c.Request.Cookie(CookieName)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
			c.Abort()
			return
		}
		tokenString := cookie.Value
		token, err := utils.ValidateToken(tokenString)

		if err != nil {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			c.Abort()
			return
		}

		claims := token.Claims.(jwt.MapClaims)
		c.Set("id", claims["id"])
		c.Set("username", claims["username"])
		/*
			num, ok := c.Get("id")
			if ok {
				fmt.Println(uint32(num.(float64)))
			}
			fmt.Println("id = ", c.GetInt64("id"), " ", claims["id"])
		*/
		c.Next()
	}
}
