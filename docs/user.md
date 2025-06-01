# User API Spec

## Register User API

Endpoint : POST /api/user

Request Body :
```json
{
	"username" : "andika_fahri",
	"password" : "password_hash",
	"name" : "Andika Fahri",
	"email" : "andika@gmail.com",
	"phone" : "123" // optional
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

## Login User API

Endpoint : POST /api/user/login

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

## Get User API

Endpoint : GET /api/users

Headers :
- Authorization : token

Response Body Success :
```json
{
	"data" : {
		"name" : "Andika Fahri",
		"username" : "andika_fahri",
		"email" : "andika@gmail.com",
		"phone" : "123", //optional
		"status" : "Aktif"
	}
}
```

Response Body Error :
```json
{
	"error" : "User not found"
}
```


## Update User API

Endpoint : PATCH /api/users

Headers :
- Authorization : token

Request Body :
```json
{
	"username" : "andika_fahri", // optional
	"name" : "Andika Fahri", // optional
	"email" : "andika@gmail.com", // optional
	"phone" : "123", // optional
	"password" : "password_hash" // optional
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

<!-- OPERATION -->
## User Order API

Endpoint : POST /api/users/order

Headers :
- Authorization : token

Request Body :
```json
{
	"id_merchant" : "id",
	"items" : [
		{
			"id_menu" : "id",
			"qty" : "1",
			"id_variant" : "id",
			"note" : "" // optional
		},
		{
			"id_menu" : "id",
			"qty" : "1",
			"id_variant" : "id",
			"note" : "" // optional
		}
	]
}
```

Response Body Success :
```json
{
	"message" : "Order success"
}
```

Response Body Error :
```json
{
	"error" : "Menu not found"
}
```

## User Get Order API

Endpoint : GET /api/users/order/:id

Headers :
- Authorization : token

Response Body Success :
```json
{
	"data" : {
		"id_merchant" : "id",
		"name_merchant" : "Andika Chili Oil",
		"date_order" : "date",
		"total" : "10000",
		"items" : [
			{
				"id_menu" : "id",
				"name_menu" : "Mie Chili Oil",
				"name_variant" : "Level 3",
				"qty" : "1",
				"note" : "", // optional
				"price" : "10000"
			}
		]
	}
}
```

Response Body Error :
```json
{
	"error" : "Order not found"
}
```