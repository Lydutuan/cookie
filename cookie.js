document.cookie="user=JaneDoe; expires=Fri, 31 Dec 2029 23:59:59 GMT; path=/; Secure; SameSite=Strict";
function getCookieValue(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i=0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

console.log(getCookieValue('user'));
console.log("Cookie set: " + document.cookie);