# Merchant API Spec

## Register Merchant API

Endpoint : POST /api/merchant

Request Body :
```json
{
	"username" : "andika_fahri",
	"password" : "password_hash",
	"name" : "Andika Chili Oil",
	"address" : "Ngebruk",
	"id_subd" : "1",
	"id_city" : "1",
	"id_prov" : "1",
	"email" : "andika@gmail.com",
	"phone" : "123" //optional
}
```

Response Body Success :
```json
{
	"message" : "Register success"
}
```

Response Body Error :
```json
{
	"error" : "Username is already"
}
```

## Login Merchant API

Endpoint : POST /api/merchant/login

Request Body :
```json
{
	"username" : "andika_fahri",
	"password" : "password_hash"
}
```

Response Body Success :
```json
{
	"username" : "andika_fahri",
	"name" : "Andika Chili Oil",
	"token" : "token"
}
```

Response Body Error :
```json
{
	"error" : "Username or password wrong"
}
```

## Get Merchant API

Endpoint : GET /api/merchant

Headers :
- Authorization : token

Response Body Success :
```json
{
	"data" : {
		"username" : "andika_fahri",
		"name" : "Andika Chili Oil",
		"address" : "Ngebruk",
		"id_subd" : "1",
		"id_city" : "1",
		"id_prov" : "1",
		"email" : "andika@gmail.com",
		"phone" : "123", //optional
		"status" : "Aktif"
	}
}
```

Response Body Error :
```json
{
	"error" : "Merchant is not found"
}
```

## Update Merchant API

Endpoint : PATCH /api/merchant

Headers :
- Authorization : token

Request Body :
```json
{
	"username" : "andika_fahri", //optional
	"name" : "Andika Chili Oil", //optional
	"address" : "Ngebruk", //optional
	"id_subd" : "1", //optional
	"id_city" : "1", //optional
	"id_prov" : "1", //optional
	"email" : "andika@gmail.com", //optional
	"phone" : "123" //optional
}
```

Response Body Success :
```json
{
	"message" : "Update success"
}
```

Response Body Error :
```json
{
	"error" : "Merchant is not found"
}
```
