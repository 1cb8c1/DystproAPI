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
    token: token 
}</pre>
</td>
</tr>
<tr>
<td>400</td>
<td>
<pre>
{
    error: {
    code: "BADARGUMENT",
    message: "Missing one of arguments needed for registration",
    },
    auth: false,
    token: null,
}</pre>
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
        longEnough: longEnough,
        hasSmallLetter: hasSmallLetter,
        hasBigLetter: hasBigLetter,
        hasNumber: hasNumber,
        hasSpecialCharacter: hasSpecialCharacter,
    },
    },
    auth: false,
    token: null,
}</pre>
</td>
</tr>
</tbody>
</table>
