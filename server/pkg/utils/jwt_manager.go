package utils

import (
	"fmt"
	"github.com/golang-jwt/jwt/v5"
	"time"
)

var SecretKey string

func CreateToken(payload map[string]any) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	// type assertions
	claims := token.Claims.(jwt.MapClaims)
	claims["id"] = payload["id"]
	claims["username"] = payload["username"]
	claims["exp"] = time.Now().Add(time.Hour / 60).Unix()
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
			// Проверяем, что токен использует алгоритм подписи HMAC и использует наш секретный ключ
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
			}
			return SecretKey, nil
		})
	if err != nil {
		return nil, err
	}

	return token, nil
}
