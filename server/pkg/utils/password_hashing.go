package utils

import (
	"crypto/rand"
	"encoding/base64"
	"golang.org/x/crypto/argon2"
)

func getSalt(length uint32) ([]byte, error) {
	salt := make([]byte, length)
	if _, err := rand.Read(salt); err != nil {
		return nil, err
	}
	return salt, nil
}

func genHash(password string, salt []byte) string {
	var timeCost uint32 = 1
	var memoryCost uint32 = 64 * 1024
	var parallelism uint8 = 1
	var keyLength uint32 = 32

	hash := argon2.IDKey([]byte(password), salt, timeCost, memoryCost, parallelism, keyLength)
	hashString := base64.StdEncoding.EncodeToString(hash)

	return hashString
}

func GenHashAndSalt(password string) (string, string, error) {
	salt, err := getSalt(16)
	if err != nil {
		return "", "", err
	}

	hashString := genHash(password, salt)
	saltString := base64.StdEncoding.EncodeToString(salt)

	return hashString, saltString, nil
}

func VerifyPasswordHash(inputPassword, hash, salt string) (bool, error) {
	byteSalt, err := base64.StdEncoding.DecodeString(salt)
	if err != nil {
		return false, err
	}
	inputHash := genHash(inputPassword, byteSalt)
	return inputHash == hash, nil
}
