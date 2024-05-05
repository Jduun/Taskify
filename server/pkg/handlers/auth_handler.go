package handlers

import (
	"errors"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"net/http"
	"server/pkg/models"
	"server/pkg/repositories"
	"server/pkg/utils"
	"time"
)

var cookieName = "token"

func handleSignIn(c *gin.Context) {
	type SignInFormData struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}
	var signInFormData SignInFormData
	if err := c.BindJSON(&signInFormData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := repositories.FindUser(signInFormData.Username)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	ok, err := utils.VerifyPasswordHash(signInFormData.Password, user.Password, user.Salt)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if !ok {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"signin": "success"})
		return
	}
	//c.IndentedJSON(http.StatusOK, gin.H{"signin": "success"})

	// send token
	payload := map[string]any{
		"id":       user.ID,
		"username": user.Username,
	}
	token, err := utils.CreateToken(payload)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//c.Header("Authorization", token)
	cookie := &http.Cookie{
		Name:     cookieName,
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	}
	http.SetCookie(c.Writer, cookie)
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Token passed successfully"})
}

func handleSignUp(c *gin.Context) {
	type SignUpFormData struct {
		Username        string `json:"username"`
		Password        string `json:"password"`
		ConfirmPassword string `json:"confirmPassword"`
	}
	var signUpFormData SignUpFormData
	if err := c.BindJSON(&signUpFormData); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	hash, salt, err := utils.GenHashAndSalt(signUpFormData.Password)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	user := models.User{
		ID:       uuid.New().ID(),
		Username: signUpFormData.Username,
		Password: hash,
		Salt:     salt,
	}

	if err = repositories.NewUser(user); err != nil {
		// Finding an error with a specific type
		var pgErr *pgconn.PgError
		ok := errors.As(err, &pgErr)
		// Unique key error (23505), which means that a user with the same name already exists
		if ok && pgErr.Code == "23505" {
			c.IndentedJSON(http.StatusConflict, gin.H{"error": err.Error()})
			return
		}
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//c.IndentedJSON(http.StatusOK, gin.H{"signup": "success"})

	// send token
	payload := map[string]any{
		"id":       user.ID,
		"username": user.Username,
	}
	token, err := utils.CreateToken(payload)
	if err != nil {
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	//c.Header("Authorization", token)
	cookie := &http.Cookie{
		Name:     cookieName,
		Value:    token,
		Path:     "/",
		Expires:  time.Now().Add(24 * time.Hour),
		HttpOnly: true,
	}
	http.SetCookie(c.Writer, cookie)
	c.IndentedJSON(http.StatusOK, gin.H{"message": "Token passed successfully"})
}

func checkToken(c *gin.Context) {
	cookie, err := c.Request.Cookie(cookieName)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	tokenString := cookie.Value
	_, err = utils.ValidateToken(tokenString)

	if err != nil {
		c.IndentedJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}

	c.IndentedJSON(http.StatusOK, gin.H{"message": "valid token"})
}
