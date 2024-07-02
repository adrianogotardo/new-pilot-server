
# API Documentation

 This is the documentation for this project. Here you can find information about the routes used, their usage rules, and the responses you can expect from each of them. If you have any questions while reading this or have suggestions for improving this text, please do not hesitate to inform us!
<br />

## Authentication
<br />

 - `POST/sign/up`: this route is used to create an user in the application.
<br />

	- Expected body:
		```
	    {
	    	"name": "User Erick",                  // a string
	    	"email": "email@provider.com",         // an email formatted string
	    	"password": "superpassword123!"        // a string
	    }
		```
	- Possible responses:
		- Success: status 201.
		- Email already registered: status 409.
		- Incompatible body: status 422 and a message indicating what's wrong.
<br />

 - `POST/sign/in`: this route is used to log in to the application.
<br />

	- Expected body:
		```
	    {
	    	"email": "email@provider.com",         // an email formatted string
	    	"password": "superpassword123!"        // a string
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
<br />

	- Expected headers:
		```
		{
			"Authentication": "token"              // a string token generated on user login
		}
		```
	- Expected body:
	 	```
		{
			"name": "Employee Smith",              // a string
			"wage": 150000,                        // an integer (actual wage * 100)
			"phone": 5522988888888,                // an optional integer
			"documentNumber": "12345678910",       // a string
			"pix": "smith.mail@provider.com",      // an optional string
			"observation": "first job",            // an optional string
			"address": {
				"street": "Flowers Street",    // a string
				"number": "Bloco A",           // a string
				"complement": "Yellow gate",   // an optional string
				"neighbourhood": "Centro",     // a string
				"city": "Santos",              // a string
				"state": "São Paulo",          // a string
				"postalCode": 12345678         // an integer
			}
		}
		```
	- Possible responses:
		- Succes: status 201.
		- Unauthorized user (inappropriate role): status 401.
		- Document number already registered: status 409.
		- Incompatible body: status 422 and a message indicating what's wrong.