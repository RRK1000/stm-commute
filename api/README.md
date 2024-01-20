### API

### Set up
`
    $ docker build -t pb:v1 .
    $ docker run -t -d -p 8080:8080 --name pocketbase pb:v1


    Set up a new admin account on http://localhost:8080/_

    Settings -> Import Collections -> pb_schema.json


    Reference curls
    $ curl --location 'http://localhost:8080/api/admins/auth-with-password' \
--form 'identity="<email>"' \
--form 'password="admin123123"'
    $ curl --location 'http://localhost:8080/api/collections/users/records' \
--header 'Authorization: TOKEN' \
--form 'name="<name>"' \
--form 'email="<email>"' \
--form 'age="<age>"' \
--form 'status="<active>"'
`