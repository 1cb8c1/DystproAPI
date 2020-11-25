# DYSTPRO API

## Overview

This project is used as REST API for distproapp.
All API access is over HTTPS and can be accesed from [dystproapi.azurewebsites.net](dystproapi.azurewebsites.net)

All data is sent and received as JSON expect one example (because of project specification to use at least one XML endpoint)

<br/><br/>

---

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

<br/>
<table>
    <thead>
        <tr>
            <th> Method </th>
            <th> Route </th>
            <th> Body </th>
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>GET</td>
        <td>/auth/me</td>
        <td></td>
        <td><pre>
{ 
    "x-access-token": token 
}</pre></td>
    </tbody>
</table>
User get's information about him.
Header <b>x-access-token</b> is required.
See authentication sub-chapter for more details.

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
<td>422</td>
<td>
<pre>
{
    error: {
        code: "BADARGUMENT",
        message: "Authorization problem. Email doesn't exist",
    },
}</pre>
</td>
<td>
For some reason, email doesn't exist in database. This shouldn't happen. Contact developers if encountered.
</td>
</tr>
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

---

## Products

In order to use products endpoints - route `/products` is used. So url will be: dystproapi.azurewebsites.net/products/

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
        <td>/products/names</td>
        <td>
            <pre>
{
    name: "product_name_you_are_searching_for"
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
    products: [
        {
            product_id: ...,
            name: ...
        },
        {
            product_id: ...,
            name: ...
        },
        ...
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

<style>
table {
    width: 100%
}
</style>
