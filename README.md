
# API Documentation

 This is the documentation for this project. Here you can find information about the routes used, their usage rules, and the responses you can expect from each of them. If you have any questions while reading this or have suggestions for improving this text, please do not hesitate to inform us!

## Authentication
<br />

 - `POST/sign/up`: this route is used to create an user in the application.
	- Expected body:
		```
	    {
	    	"name": "User Erick",                          // string
	    	"email": "email@provider.com",                 // email formatted string
	    	"password": "superpassword123!"                // string
	    }
		```
	- Possible responses:
		- Success: status 201.
		- Email already registered: status 409.
		- Incompatible body: status 422 and a message indicating what's wrong.
<br />

 - `POST/sign/in`: this route is used to log in to the application.
	- Expected body:
		```
	    {
	    	"email": "email@provider.com",                 // email formatted string
	    	"password": "superpassword123!"                // string
	    }
		```
	- Possible responses:
		- Success: status 200 and an authenticated token.
		- Email not registered: status 404.
		- Incorrect password: status 401.
		- Incompatible body: status 422 and a message indicating what's wrong.

## Employees
<br />

 - `POST/employee`: this route is used to insert a new employee in the application.
	- Expected headers:
		```
		{
			"Authentication": "token",                     // string token generated on user login
			"time-zone": "/America/Sao_Paulo"              // string (timezone in wich the front-end is operating)
		}
		```
	- Expected body:
	 	```
		{
			"name": "Employee Smith",                      // string
			"wage": 150000,                                // integer (actual wage * 100)
			"phone": 5522988888888,                        // optional integer
			"documentNumber": "12345678910",               // string
			"pix": "smith.mail@provider.com",              // optional string
			"observation": "first job",                    // optional string
			"address": {
				"street": "Flowers Street",            // string
				"number": "Bloco A",                   // string
				"complement": "Yellow gate",           // optional string
				"neighbourhood": "Centro",             // string
				"city": "Santos",                      // string
				"state": "São Paulo",                  // string
				"postalCode": 12345678                 // integer
			}
		}
		```
	- Possible responses:
		- Succes: status 201.
		- Unauthorized user (inappropriate role): status 401.
		- Document number already registered: status 409.
		- Incompatible headers: status 422 and a message indicating what's wrong.
		- Incompatible body: status 422 and a message indicating what's wrong.
<br />

 - `GET/employee`: this route is used to get a list of registered employees and can filter the results by date range and/or activity status. It also allows the user to specify it the response should includes the address details of each employee or not.
	- Expected headers:
		```
		{
			"Authentication": "token",                     // string token generated on user login
			"time-zone": "/America/Sao_Paulo"              // string (timezone in wich the front-end is operating)
		}
		```
	- Possible query params:
		- `stardDate` and `endDate`: limit values of a date range to filter the selection by date. They must be following the ISO 8601 format.
			- Example: `get/employee?stardDate=2023-01-01T00:00:00+03:00&endDate=2023-12-31T23:59:59-03:00`
		- `isActive`: boolean value converted to string. It will determine if the response should get only active or only inactive employees.
			- Example: `get/employee?isActive=false`
	- Example of response in case of succeeded request:
		```
		[
			{
				"id": 12,                              // integer
				"name": "Employee Smith",              // string
				"wage": "150000",                      // string of (actual wage * 100)
				"hiredAt": "2023-01-01T00:00:00+03:00" // ISO 8601 date
				"phone": "5522988888888",              // string
				"documentNumber": "12345678910",       // string
				"pix": "smith.mail@provider.com",      // optional string
				"isActive": true,                      // boolean
				"observation": "first job",            // optional string
				"address": {
					"street": "Flowers Street",    // string
					"number": "Bloco A",           // string
					"complement": "Yellow gate",   // optional string
					"neighbourhood": "Centro",     // string
					"city": "Santos",              // string
					"state": "São Paulo",          // string
					"postalCode": "12345678"       // string
				}
			},
			// (...)
		]
		```
	- Possible responses:
		- Success: status 201 and an array of employee objects.
		- Unauthorized user (inappropriate role): status 401.
		- Incomplete date range: status 422 and a message.
<br />

 - `PUT/employee/:id`: this route is used to update the data of a employee registered in the application.
	- Expected headers:
		```
		{
			"Authentication": "token"                      // string token generated on user login
		}
		```
	- Expected body (same as in POST):
	 	```
		{
			"name": "Employee Smith",                      // string
			"wage": 150000,                                // integer (actual wage * 100)
			"phone": 5522988888888,                        // optional integer
			"documentNumber": "12345678910",               // string
			"pix": "smith.mail@provider.com",              // optional string
			"observation": "first job",                    // optional string
			"address": {
				"street": "Flowers Street",            // string
				"number": "Bloco A",                   // string
				"complement": "Yellow gate",           // optional string
				"neighbourhood": "Centro",             // string
				"city": "Santos",                      // string
				"state": "São Paulo",                  // string
				"postalCode": 12345678                 // integer
			}
		}
		```
	- Possible responses:
		- Succes: status 200.
		- Unauthorized user (inappropriate role): status 401.
		- Incompatible headers: status 422 and a message indicating what's wrong.
		- Incompatible body: status 422 and a message indicating what's wrong.
		- Incompatible query param (:id): status 422 and a message indicating what's wrong.
		- User not found: status 404.
		- Document number informed in body belongs to another employee: status 409.
<br />

 - `PUT/employee/reactivate/:id`: this route is used to reactivate an employee that has been previously deactivated.
	- Expected headers:
		```
		{
			"Authentication": "token"                      // string token generated on user login
		}
		```
	- Possible responses:
		- Succes: status 200.
		- Unauthorized user (inappropriate role): status 401.
		- Incompatible query param (:id): status 422 and a message indicating what's wrong.
		- User not found: status 404.
		- User is already active: status 406.
<br />

 - `DELETE/employee/:id`: this route is used to deactivate an employee that has been previously active.
	- Expected headers:
		```
		{
			"Authentication": "token"                      // string token generated on user login
		}
		```
	- Possible responses:
		- Succes: status 200.
		- Unauthorized user (inappropriate role): status 401.
		- Incompatible query param (:id): status 422 and a message indicating what's wrong.
		- User not found: status 404.
		- User is already inactive: status 406.
<br />