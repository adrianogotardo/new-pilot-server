
# API Documentation

 This is the documentation for this project. Here you can find information about the routes used, their usage rules, and the responses you can expect from each of them. If you have any questions while reading this or have suggestions for improving this text, please do not hesitate to inform us!

## Authentication

 - `POST/sign/up`

	This route is used to create an user in the application.
	 - Expected body:
		```
	    {
	    	"name": "User Erick",
	    	"email": "email@provider.com",
	    	"password": "superpassword123!"
	    }
		```
	- Possible responses:
		- Success: status 201.
		- Email already registered: 409.
		- Incompatible body: 422.

 - `POST/sign/in`

	This route is used to log in to the application.
	 - Expected body:
		```
	    {
	    	"email": "email@provider.com",
	    	"password": "superpassword123!"
	    }
		```
	- Possible responses:
		- Success: status 200 and an authenticated token.
		- Email not registered: status 404.
		- Incorrect password: status 401.
		- Incompatible body: status 422.
