/**
 * Created by omar on 2017-03-10.
 */

export function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function checkCookie() {
    var user=getCookie("username");

    if (user != "") {
        alert("Welcome again " + user);
    } else {
        let user = Fake.word();
        setCookie("username", user, 30);
    }
}

export function deleteCookies(){
    var cookie = document.cookie.split(';');

    for (var i = 0; i < cookie.length; i++) {

        var chip = cookie[i],
            entry = chip.split("="),
            name = entry[0];

        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
}