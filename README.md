# Catalog of stolen bikes 

## Introduction 
This project is a rest Api endpoint used by the police and private citizens to handle the cases of stolen bikes. where the private citizen report the stolen bikes and the police handle the cases.The rest Api is open to public to report. and only police can mark the cases as resolved .

## Tech used in this project.
- `docker-compose` for docker orchestration
- `postgres` for database.
- `express` server written in typescript.
- `knex.js` for query builder in TS.
- `jest` for api testing.

### Requirements
- [x] The police wants to able to add, edit and remove officers. (See data model suggestion below)
- [x] Private citizens want to be able to report stolen bikes. (See data model suggestion below)
- [x] The system should assign a police offers to handle stolen bike cases as they are being reported.
- [x] A police officer can only handle one case at a time.
- [x] The police should be able to report bikes as found.
- [x]  When the police finds a bike the case should be marked as resolved and the police officer in charge of the case should be marked as available to take a new case.
- [x] The system should be able to assign unassigned cases to police officers as they become available.
- [x]  Police and private citizens both want to be able to list the reported bike thefts and their status.

## How to test
This project used docker-compose in order to run it you have to have a docker-compose install on your machine.
- Clone or download the repo from https://github.com/tareef88/backend
- Run `docker-compose up -d `in the root directory.
- After the services ar up you can log the output of docker-compose by running `docker-compose logs -f ` or you can tail it to the last 1000 logs `docker-compose logs -f --tail="1000"`
- To do the migrations run `npm run migrate` where the migrations that has been added to `./migrations` will be executed and in our case we have 2 tables `cases` and `officers`.
- Run the api testing by `npm run test`.
- Now the Api is ready to be tested using `postman`.
# Endpoints in the project
------------
## Private Citizen: `/privateCitizen`
Private citizen has two methods `GET/POST`:
for local testing we will use localhost as hosting since we map the backend port docker container to 3000 localy .

### 1-  Get cases
Used to show all the cases reported before
```js
Endpoint GET: `http://localhost:3000/privateCitizen/cases`
```
```js
Body : `N/A`
```
```js
Headers : {
"Content-Type": "application/json" 
}
```
```js
Response: {
    "data": {
        "cases": [
            {
                "id": 1,
                "title": "stolenBike",
                "brand": "BMX",
                "description": "stolen Bike in Malmo",
                "city": "MALMO",
                "reported": "2020-03-07T16:50:51.151Z",
                "updated": "2020-03-07T16:51:24.833Z",
                "officer_id": null,
                "solved": true,
                "image": "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"
            },
            {
                "id": 2,
                "title": "stolen bike",
                "brand": "BMX",
                "description": "fsfsfsfsfsf",
                "city": "Malmo",
                "reported": "2020-03-07T16:52:38.140Z",
                "updated": "2020-03-07T16:52:38.152Z",
                "officer_id": "1",
                "solved": false,
                "image": "http://asfaf.png"
            }
        ]
    }
}
```

### 2-  Report case 
Used to report case by citizens
```js
Endpoint POST: `http://localhost:3000/privateCitizen/report`
```
```js
Body : {
    "title": "stolen bike",
    "brand": "BMX",
    "city": "Malmo",
    "description": "fsfsfsfsfsf",
    "image": "http://asfaf.png"
}
```
```js
Headers : {
"Content-Type": "application/json" 
}
```
```js
Response: {
    "data": {
        "case": {
            "id": 6,
            "title": "stolen bike",
            "brand": "BMX",
            "description": "fsfsfsfsfsf",
            "city": "Malmo",
            "reported": "2020-03-08T11:07:00.032Z",
            "updated": null,
            "officer_id": null,
            "solved": false,
            "image": "http://asfaf.png"
        }
    }
}
```


## Police: `/privateCitizen`
Police has 4 methods `GET/POST/PATCH/DELETE`:
for local testing we will use localhost as hosting since we map the backend docker-container to 3000 localy .
In the police route we use to authorize request. and It has to belong to one of the police
in the database.

`token = '566515d6-5f12-11ea-bc55-0242ac130003'`

### 1 -  Get cases
Used to show all the cases reported before.
```js
Endpoint GET: `http://localhost:3000/privateCitizen/cases`
```
```js
Body : `N/A`
```
```js
Headers : {
"Content-Type": "application/json" 
}
```
```js
Response: {
    "data": {
        "cases": [
            {
                "id": 1,
                "title": "stolenBike",
                "brand": "BMX",
                "description": "stolen Bike in Malmo",
                "city": "MALMO",
                "reported": "2020-03-07T16:50:51.151Z",
                "updated": "2020-03-07T16:51:24.833Z",
                "officer_id": null,
                "solved": true,
                "image": "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"
            },
            {
                "id": 2,
                "title": "stolen bike",
                "brand": "BMX",
                "description": "fsfsfsfsfsf",
                "city": "Malmo",
                "reported": "2020-03-07T16:52:38.140Z",
                "updated": "2020-03-07T16:52:38.152Z",
                "officer_id": "1",
                "solved": false,
                "image": "http://asfaf.png"
            }
        ]
    }
}
```


### 2 -  Add officer
This only used by the police to addd officers.
```js
Endpoint POST: `http://localhost:3000/police/addOfficer`
```
```js
Body : {
    "name": "Test officer"
}
```
```js
Headers : {
"Content-Type": "application/json" ,
"Authorization" : "Bearer 566515d6-5f12-11ea-bc55-0242ac130003"
}
```
```js
Response: {
    "data": {
        "newOfficer": {
            "id": 7,
            "name": "Test officer",
            "token": "90baf31f-f1e7-47ed-b08d-3b577385382d",
            "engaged": false
        }
    }
}
```

### 3 - Update officer
This  used by the police officer or by the system to upadte the `name` or status `engaged` or `token` .

```js
Endpoint PATCH: `http://localhost:3000/police/updateOfficer/${officer_id}`
```
```js
Body : {
	"name":"Test officer updated",
	"token": "566515d6-5f12-11ea-bc55-0342ac130003",
	"engaged": false
}
```
```js
Headers : {
"Content-Type": "application/json" ,
"Authorization" : "Bearer 566515d6-5f12-11ea-bc55-0242ac130003"
}
```
```js
Response: {
    "data": {
        "id": 2,
        "name": "Test officer updated",
        "token": "566515d6-5f12-11ea-bc55-0342ac130003",
        "engaged": false
    }
}
```


### 4 - Delete officer
This  used by the police officers to delete officers completly from the system .

```js
Endpoint DELETE: `http://localhost:3000/police/deleteOfficer/${officer_id}`
```
```js
Body : N/A
```
```js
Headers : {
"Content-Type": "application/json" ,
"Authorization" : "Bearer 566515d6-5f12-11ea-bc55-0242ac130003"
}
```
```js
Response: {
    "data": {
        "message": "Successfully deleted officer wit id 6"
    }
}
```


### 5 - Solve case
This  used by the police officers to solve cases and free police officers or assign them to another case.

```js
Endpoint PATCH: `http://localhost:3000/police/deleteOfficer/${officer_id}`
```
```js
Body : N/A
```
```js
Headers : {
"Content-Type": "application/json" ,
"Authorization" : "Bearer 566515d6-5f12-11ea-bc55-0242ac130003"
}
```
```js
{
    "data": {
        "id": 1,
        "title": "stolenBike",
        "brand": "BMX",
        "description": "stolen Bike in Malmo",
        "city": "MALMO",
        "reported": "2020-03-07T16:50:51.151Z",
        "updated": "2020-03-08T12:41:38.951Z",
        "officer_id": null,
        "solved": true,
        "image": "https://miro.medium.com/max/1200/1*mk1-6aYaf_Bes1E3Imhc0A.jpeg"
    }
}
```


# Data Models

### officers

| Coulmn        | type           | description  |
| ------------- |:-------------:| -----:|
| id     | integer |  |
| name      | string      |   officers names |
| token | string/uuid      |    used to Authenticated request |
| engaged | Boolean      |    inducate police status |


-------
### cases

| Coulmn        | type           | description  |
| ------------- |:-------------:| -----:|
| id     | integer |  |
| title      | String	      |   Title of report |
| brand | String      |    Brand of bike |
| city | String      |    City where theft occured  |
| description | String      |    Description of bike |
| reported | DateTime      |    Date and time when theft was reported |
| updated | DateTime      |    Date and time when case was last updated |
| solved | Boolean      |    True when case has been solved  |
| officer | Integer      |    Officer in charge of the case |
| image | String      |    Image of bike  |




