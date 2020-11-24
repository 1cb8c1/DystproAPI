# DYSTPRO API

## Overview

This project is used as REST API for distproapp.
All API acces is over HTTPS and can be accesed from [dystproapi.azurewebsites.net](dystproapi.azurewebsites.net)

All data is sent and receives as JSON expect one example (because of project specification to use at least one XML endpoint)

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
            <th> Headers </th>
        </tr>
    </thead>
    <tbody>
        <td>GET</td>
        <td>/auth/me</td>
        <td>
            <pre>
{ 
    "x-access-token": token 
}</pre>
        </td>
    </tbody>
</table>
User get's information about him.

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
    auth: true, token: ... 
}</pre>
</td>
<td>
Successful login
</td>
</tr>
</tbody>
</table>
