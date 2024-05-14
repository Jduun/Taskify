package utils

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var SecretKey string

func CreateToken(payload map[string]any) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims) // type assertions
	claims["id"] = payload["id"]
	claims["username"] = payload["username"]
	claims["exp"] = time.Now().Add(time.Hour).Unix()
	// We sign this token with SecretKey
	tokenString, err := token.SignedString([]byte(SecretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func ValidateToken(tokenString string) (*jwt.Token, error) {
	token, err := jwt.Parse(
		tokenString,
		func(token *jwt.Token) (interface{}, error) {
			// We check that the token uses the HMAC signature algorithm and uses our secret key
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return []byte(SecretKey), nil
		})
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return token, nil
}
