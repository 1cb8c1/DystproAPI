# DYSTPRO API

## Overview

This project is used as REST API for dystproapp.
The goal of dystproapp is to provide a system that helps in the manufacturers logictics.

All data is sent and received as JSON expect one example (because of project specification to use at least one XML endpoint). API can be accessed through dystproapi.azurewebsites.net.

<br/><br/>

## Running dystproapi

In order to run dystproapi use command `npm start`.
To run tests use `npm test`.

<br/><br/>

## Configuration

Configuration is in the file Config.js <br/>
Values of `SECRET`, `PORT` and `SQLAZURECONNSTR_DYSTPROOWNER` are set through
environment variables (through azure).<br/>
`SECRET` (with password creation date) is used for signing tokens.<br/>
`PORT` specifies port that app will be listening to.<br/>
`SQLAZURECONNSTR_DYSTPROOWNER` is database connection string.

<br/><br/>
<br/><br/>

---

# API

## Authentication

There is only one way to authenticate through `dystpro API`.\
It's done through [JSON Web Tokens](https://tools.ietf.org/html/rfc7519).
Route `/auth` is used. So url will be: dystproapi.azurewebsites.net/auth/

<br/><br/>

### Registration

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td>POST</td>
        <td>/auth/register</td>
        <td>
            <pre>
{
    email: "example@email.com,
    password: "!examplePassword123"
}</pre>
        </td>
    </tbody>
</table>
User registers through email. Password has to be at least 8 characters long, have at least one big and small letter, special character and number.

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    auth: true, 
    token: ... 
}</pre>
</td>
<td>
Successful registration
</td>
</tr>
<tr>
<td>400</td>
<td>
<pre>
{
    error: {
        code: "BADARGUMENT",
        message: "Missing one of the arguments needed for registration",
    },
    auth: false,
    token: null,
}</pre>
</td>
<td>
One of the arguments is missing
</td>
</tr>
<tr>
<td>422</td>
<td>
<pre>
{
    error: {
        code: "BADARGUMENT",
        message: "Password isn't strong enough",
        details: {
            longEnough: ...,
            hasSmallLetter: ...,
            hasBigLetter: ...,
            hasNumber: ...,
            hasSpecialCharacter: ...,
    },
    },
    auth: false,
    token: null,
}</pre>
</td>
<td>
Values from details will be bollean
</td>
</tr>
</tbody>
</table>

<br/><br/>

### User info

User get's information about him.
Header <b>x-access-token</b> is required.
See authentication sub-chapter for more details.

<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td>GET</td>
        <td>/auth/me</td>
        <td></td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
    user: { 
        email: ...
    }
}</pre>
</td>
<td>
Successful reguest
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Login

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td>POST</td>
        <td>/auth/login</td>
        <td>
            <pre>
{ 
    email: "example@examplemail.com",
    password: "examplePassword!1" 
}</pre>
        </td>
    </tbody>
</table>
User get's token used for authentication.

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    auth: true, 
    token: ... 
}</pre>
</td>
<td>
Successful login
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Authentication

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>
In order to access some endpoints, header <b>x-access-token</b> is required. Token can be retrived by login.

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
<tr>
<td>401</td>
<td>
<pre>
{
    error: {
        code: "BADARGUMENT",
        message: "No token provided.",
    },
    auth: false,
}</pre>
</td>
<td>
No header with token was provided.
</td>
</tr>
<tr>
<td>401</td>
<td>
<pre>
{
    error: {
        code: "BADARGUMENT",
        message: "Failed to verify token.",
    },
    auth: false,
}</pre>
</td>
<td>
Token wasn't correct.
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Authorization

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>
In order to access some endpoints, header <b>x-access-token</b> is required. Token can be retrived by login.

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
<tr>
<td>401</td>
<td>
<pre>
{
    error: {
        code: "NOTAUTHORIZED",
        message: "User not authorized",
    },
}</pre>
</td>
<td>
User doesn't have permissions to access this resourse.
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Roles

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>
In order to access some endpoints, header <b>x-access-token</b> is required. Token can be retrived by login.

<br/><br/>

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td>GET</td>
        <td>/auth/me/roles</td>
        <td>
            <pre>
</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body </th>
<th> Description </th>
</tr>
</thead>
<tbody>
<tr>
<td>401</td>
<td>
<pre>
{
    roles: 
    [
        "DISTRIBUTOR",
        "TESTER"
    ],
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

---

## Products

In order to use products endpoints - route `/products` is used. So url will be: dystproapi.azurewebsites.net/products/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### Products names

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/products/</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    products: [
        { 
            name: "Plytki wielkorzebne czarne", 
            product_id: 1   
        },
        { 
            name: "Plytki wielkorzebne niebieskie", 
            product_id: 2 
        },
        { 
            name: "Plytki wielkorzebne szarne", 
            product_id: 3 
        },
    ]
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Product details

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/products/:id</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>
Example: /products/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>{ 
    product:
        {
        availability: [
            {
            amount: 300,
            product_warehouse_id: 1,
            warehouse_name: "Lódz Baluty 1",
            },
            {
            amount: 100,
            product_warehouse_id: 2,
            warehouse_name: "Lódz Baluty 2",
            },
            {
            amount: 0,
            product_warehouse_id: 3,
            warehouse_name: "Lódz Baluty 3",
            },
        ],
        name: "Plytki wielkorzebne czarne",
        price: 3000,
        product_id: 1,
        unit_name: "m2",
        unit_number: 300,
        weight: 1500,
        }
}      
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

<br/><br/>

---

## Drivers

In order to use drivers endpoints - route `/drivers` is used. So url will be: dystproapi.azurewebsites.net/drivers/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### List of drivers

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/drivers/</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    drivers: [
        { 
            driver_id: 1, 
            name: "Jacek",
            surname: "Placek",
        },
        {      
            driver_id: 2, 
            name: "Anita",
            surname: "Wagner",
        }
    ]
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Add driver

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> POST </td>
        <td>/drivers/</td>
        <td>
<pre>
{ 
    driver:
        { 
            name: "Jacek",
            surname: "Placek",
        },
}    
</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    driver: 
        { 
            driver_id: 1, 
            name: "Jacek",
            surname: "Placek",
        },
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Remove driver

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> DELETE </td>
        <td>/drivers/:id</td>
        <td>
<pre> 
</pre>
        </td>
    </tbody>
</table>
Example: /drivers/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Modify driver

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> PATCH </td>
        <td>/drivers/:id</td>
        <td>
<pre> 
{ 
    driver: 
        { 
            driver_id: 1, 
            name: "Anya",
            surname: "Gorye",
        },
}
</pre>
        </td>
    </tbody>
</table>
If you want to update only name, just don't include surname.

Example: /drivers/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

<br/><br/>

---

## Vehicles

In order to use vehicles endpoints - route `/vehicles` is used. So url will be: dystproapi.azurewebsites.net/vehicles/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### List of vehicles

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/vehicles/</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    vehicles: [
        { 
            vehicle_id: 1, 
            registration_number: "TMD 8836",
        },
        {      
            vehicle_id: 2, 
            registration_number: "TDA 5579",
        }
    ]
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Add vehicle

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> POST </td>
        <td>/vehicles/</td>
        <td>
<pre>{
    vehicle: 
        { 
            vehicle_id: 1, 
        }
} 
</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
    vehicle: 
        { 
            vehicle_id: 1, 
            registration_number: "TMD 8836",
        }
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Remove vehicle

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> DELETE </td>
        <td>/vehicles/:id</td>
        <td>
<pre> 
</pre>
        </td>
    </tbody>
</table>
Example: /vehicles/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>
<br/><br/>

---

## Requests

In order to use requests endpoints - route `/requests` is used. So url will be: dystproapi.azurewebsites.net/requests/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### Add request

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> POST </td>
        <td>/requests/</td>
        <td>
            <pre>{ 
    info: "please add me to..."
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{ 
    request: {
        request_id: 1,
        info: "please add me to..."
    }
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

<br/><br/>

---

## Reservations

In order to use reservations endpoints - route `/reservations` is used. So url will be: dystproapi.azurewebsites.net/reservations/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### Get request

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/reservations/:id</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>
example: /reservations/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
        reservation: {
          reservation_id: 170,
          product_warehouse_id: 1,
          amount: 50,
          reservation_date: '2020-12-17T10:51:13.687Z',
          price: 142500,
          product_id: 1,
          name: 'Plytki wielkorzebne czarne',
          warehouse_name: 'Lódz Baluty 1'
        }
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Get reservations

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/reservations</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
        reservations: [
            {
                reservation_id: 170,
                product_warehouse_id: 1,
                amount: 50,
                reservation_date: '2020-12-17T10:51:13.687Z',
                price: 142500,
                product_id: 1,
                name: 'Plytki wielkorzebne czarne',
                warehouse_name: 'Lódz Baluty 1'
            },
            {
                reservation_id: 180,
                product_warehouse_id: 2,
                amount: 150,
                reservation_date: '2020-10-17T12:53:10.687Z',
                price: 400500,
                product_id: 1,
                name: 'Plytki wielkorzebne czarne',
                warehouse_name: 'Lódz Baluty 2'
            }
        ]
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Add reservation

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> POST </td>
        <td>/reservations</td>
        <td>
<pre>{
        reservation: {
          product_warehouse_id: 1,
          amount: 100,
        },
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
        reservation: {
          reservation_id: 170,
          product_warehouse_id: 1,
          amount: 50,
          reservation_date: '2020-12-17T10:51:13.687Z',
          price: 142500,
          product_id: 1,
          name: 'Plytki wielkorzebne czarne',
          warehouse_name: 'Lódz Baluty 1'
        }
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Delete reservation

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> DELETE </td>
        <td>/reservations/:id</td>
        <td>
<pre></pre>
        </td>
    </tbody>
</table>
example: /reservations/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

<br/><br/>

---

## Dispatches

In order to use dispatches endpoints - route `/dispatches` is used. So url will be: dystproapi.azurewebsites.net/dispatches/

<br/>
<table>
    <thead>
        <tr>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

### Get request

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/dispatches/:id</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>
example: /dispatches/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
    dispatch: {
        dispatch_id: 85,
        pickup_planned_date: '2021-01-03T21:34:28.870Z',
        driver: { driver_id: 1644, name: 'Jacek', surname: 'Kacek' },
        vehicle: { vehicle_id: 1809, registration_number: 'KER 3321' },
                states: [
                    {
                        "state":"CREATED","date":"2020-12-27T21:50:14.133Z"
                    }
                    {
                        "state":"CANCELED","date":"2020-12-28T21:50:10.133Z"
                    }
                ],
        dispatched_products: [
            {
                "name":"Plytki wielkorzebne czarne",
                "amount":100,
                "price":285000
            },
            {
                "name":"Plytki wielkorzebne niebieskie",
                "amount":20,
                "price":76000
            }
        ]
    }
}

</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Get dispatches

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> GET </td>
        <td>/dispatches</td>
        <td>
            <pre></pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
    dispatches: [
        {
            dispatch_id: 3,
            state: 'CANCELED',
            date: '2020-12-25T16:43:10.730Z',
            pickup_planned_date: '2021-01-01T16:29:13.147Z'
        },
        {
            dispatch_id: 4,
            state: 'CANCELED',
            date: '2020-12-25T16:44:20.810Z',
            pickup_planned_date: '2021-01-01T16:44:20.477Z'
        },
        {
            dispatch_id: 5,
            state: 'CANCELED',
            date: '2020-12-25T17:21:38.697Z',
            pickup_planned_date: '2021-01-01T17:21:38.197Z'
        },
    ]
}</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Add dispatch

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> POST </td>
        <td>/dispatches</td>
        <td>
<pre>
{
    dispatch: {
          driver_id: 10,
          vehicle_id: 20,
          pickup_planned_date: '2021-01-03T21:34:28.870Z'(optional),
          reservations_ids: [30,40,41]
        }
}</pre>
        </td>
    </tbody>
</table>

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
{
    dispatch: {
        dispatch_id: 85,
        pickup_planned_date: '2021-01-03T21:34:28.870Z',
        driver: { driver_id: 1644, name: 'Jacek', surname: 'Kacek' },
        vehicle: { vehicle_id: 1809, registration_number: 'KER 3321' },
        states: [
            {
                "state":"CREATED","date":"2020-12-27T21:50:14.133Z"
            }
        ],
        dispatched_products: [
            {
                "name":"Plytki wielkorzebne czarne",
                "amount":100,
                "price":285000
            },
            {
                "name":"Plytki wielkorzebne niebieskie",
                "amount":20,
                "price":76000
            }
        ]
    }
}
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>

### Delete dispatch

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
        </tr>
    </thead>
    <tbody>
        <td> DELETE </td>
        <td>/dispatches/:id</td>
        <td>
<pre></pre>
        </td>
    </tbody>
</table>
example: /dispatches/1

<br/><br/>

Responses:

<table>
<thead>
<tr>
<th> HTTP Code </th>
<th> Body Example</th>
<th> Description </th>
</tr>
</thead>
<tbody>
</tr>
<tr>
<td>200</td>
<td>
<pre>
</pre>
</td>
<td>
Successful request
</td>
</tr>
</tbody>
</table>

<br/><br/>
