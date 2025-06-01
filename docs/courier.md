# Courier API Spec

## Login Courier API

Endpoint : POST /api/courier/login

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
	"name" : "Andika Fahri",
	"token" : "token"
}
```

Response Body Error :
```json
{
	"error" : "Username or password wrong"
}
```

## Get Courier API

Endpoint : GET /api/courier

Headers :
- Authorization : token

Response Body Success :
```json
{
	"data" : {
		"username" : "andika_fahri",
		"name" : "Andika Fahri",
		"email" : "andika@gmail.com",
		"phone" : "123", //optional
		"status" : "Aktif",
		"number_plate" : "123",
		"id_brand" : "1",
		"color" : "Hitam"
	}
}
```

Response Body Error :
```json
{
	"error" : "User not found"
}
```

## Update Courier API

Endpoint : PATCH /api/courier

Headers :
- Authorization : token

Request Body :
```json
{
	"username" : "andika_fahri", //optional
	"name" : "Andika Fahri", //optional
	"email" : "andika@gmail.com", //optional
	"phone" : "123", //optional
	"number_plate" : "123", //optional
	"id_brand" : "1", //optional
	"color" : "Hitam" //optional
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
	"error" : "Username is already"
}
```

## Get Progress Courier API

Endpoint : GET /api/courier/progress

Headers :
- Authorization : token

Response Body Success :
```json
{
	"data" : {
		"progress" : "Standby"
	}
}
```

Response Body Error :
```json
{
	"error" : "User not found"
}
```

<!-- OPERATION -->
<!-- PERLU REVISI -->
## Pick Up Order Courier API

Endpoint : PUT /api/courier/progress

Headers :
- Authorization : token

Request Body :
```json
{
	"id_order" : "123",
	"id_progress" : "1"
}
```

Response Body Success :
```json
{
	"message" : "Update progress success"
}
```

Response Body Error :
```json
{
	"error" : "Order not found"
}
```
