package handlers

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"server/pkg/models"
	"server/pkg/repositories"
)

func handleSignIn(с *gin.Context) {

}

func handleSignUp(c *gin.Context) {
	type SignUpFormData struct {
		Email           string `json:"email"`
		Username        string `json:"username"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirmPassword"`
	}
	var signUpData SignUpFormData
	if err := c.BindJSON(&signUpData); err != nil {
		c.IndentedJSON(400, gin.H{"error": err.Error()})
		return
	}
	c.IndentedJSON(200, gin.H{"username": signUpData.Username, "password": signUpData.Password})
	fmt.Println(signUpData.Username, " ", signUpData.Password)

	user := models.User{
		ID:       1,
		Email:    signUpData.Email,
		Username: signUpData.Username,
		Password: signUpData.Password,
		Salt:     "salt",
	}

	var err error
	if err = repositories.NewUser(user); err != nil {
		log.Fatalf("Error when adding a new user: %s\n", err.Error())
	}
}
