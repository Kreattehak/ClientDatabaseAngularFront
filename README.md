# ClientDatabaseAngularFront

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.2.7.

It's a front-end app which consumes RESTful Web Service from `ClientDatabase` project on my github. 

For the best user experience please use this app with that project.

## Live Preview

<p><a href="https://kreattehak.github.io/ClientDatabaseAngularFront/" target="_blank">
Click to visit the project website.</a></p>

### Live preview compared to original project

```
There are only two http get calls - one to get all clients and another one to get client addresses.
This preview use InMemoryWebApi, with delay set to 150ms.
No JWT authentication, no token validation and expiration, any data entered cause login.
Only english language.
No data resolvers.
Address/Client validation from backend is not available, i.e.you can add another address with the same data.
All changes made by user are stored in browser local storage.
```

## Quick setup

```
1. Create folder on your drive
2. Clone this repo git clone https://github.com/kamil-olejniczak/ClientDatabaseAngularFront.git
3. npm install
  3.1. In meantime you can run my other back-end project `ClientDatabase` 
  It will deliver data to front-end app. More info on the project github page.
4. Go get yourself a cup of coffee while node is installing required packages.
5. npm start
6. Go to this link http://localhost:4200/
```

## More about this project

This project was created to learn how angular 2 works and how to consume REST in Java.
It was created simultaneously with `ClientDatabase`.
In the process of creating, it went through few phases, from simple one page app with table of clients to fully operational CRUD app that communicates with back-end server and makes changes on the database. Later I added JSON Web Token authentication, to provide some control on what data can see and change particular user. 

The hardest part of creating this app was to always consider change detection implications as I developed it over time.

### But what it exactly does?

This project shows client data stored in database. You can add new, delete or modify existing clients and their addresses. It has basic logic, to prevent user from deleting last or main user address, to prevent user from executing actions that would not change any state e.g. change main address to the same address, it also has validation restrictions e.g. zip code pattern. More complicated logic takes place on back-end server. This project uses data resolvers, route guards, routing and secondary route.

## Screenshots

![main page](https://github.com/kamil-olejniczak/ClientDatabaseAngularFront/blob/screenshots/main_page.png "Main page with table of clients")
Main page with table of clients

![filtering clients](https://github.com/kamil-olejniczak/ClientDatabaseAngularFront/blob/screenshots/filter_applied.png "Filtering clients by <any devito>")
Filtering clients by `any devito`

![client details](https://github.com/kamil-olejniczak/ClientDatabaseAngularFront/blob/screenshots/client_details.png "Client details page")
Client details page

![secondary route](https://github.com/kamil-olejniczak/ClientDatabaseAngularFront/blob/screenshots/secondary_route.png "Use of secondary route when clicking About Author")
Use of secondary route when clicking About Author

![selected client](https://github.com/kamil-olejniczak/ClientDatabaseAngularFront/blob/screenshots/selected_row.png "Selected row with client data")
Table on main page is 'clickable', before you can perform any action from buttons below you need to select
one row.

## Install npm packages

Install the npm packages described in the `package.json` and verify that it works:

```
npm install
npm start
```
The npm start command first compiles the application and then simultaneously re-compiles and runs the application whenever a change was made.

> The `scripts` object in `package.json` has property `start` changed to `ng serve --proxy-config proxy-conf.json` which allows to obtain JSON from RESTful Web Service.

## Internationalization

`Package.json` contains two additional scripts to build and then serve app with specified locale.

Use:
`npm run-script start[locale]` - where locale can be 'en' or 'pl' e.g. `npm run-script startpl`

You have to use npm `run-script` because `startpl` isn't build in script name that can be overridden. Both scripts take care of launching app with a proxy, so you don't have to specify it. 

## REST resources

```
/api/getAllClients - return all clients in array [GET]
/api/admin/getClient - with id parameter, to get desired client [GET]
/api/admin/updateClient - updates client in database [PUT]
/api/admin/deleteClient - deletes client from database [POST - because angular doesn't send body with DELETE]
/api/admin/saveNewClient - saves client in database after data validation [POST]

/api/admin/getAllAddresses - with id parameter, get all client's addresses [GET]
/api/admin/saveNewAddress - with id parameter, save new address to database after validation [POST]
/api/admin/updateAddress - updates address in database after validation [PUT]
/api/admin/deleteAddress - delete one of client's addresses [POST - why? Check few above]
/api/admin/editMainAddress - edit client's main address [PUT]
```

## Used packages

```
ng2-toastr - simple notifications when something is happening i.e. error or success messages
bootstrap - basic styling
bootbox - another notifications that need user action to disappear i.e. confirmation
jquery -  required by other frameworks
font-awesome - awesome fonts
```

## Future of this project

[DONE] It's very likely possible that I will provide some data which would allow this app to work even without rest resources.

[DONE] It's very likely possible that I will implement Angular unit and integration tests in this project.

<p>Now this project is used as a part of AnimalShelterManagement - <a href="https://github.com/kamil-olejniczak/AnimalShelterManagement/" target="_blank">
Click here to visit AnimalShelterManagement</a></p>
