export const capitalize = (word) => {
    const lower = word.toLowerCase()
    return lower.charAt(0).toUpperCase() + lower.slice(1)
}

export const titlePage = (title) => {
    document.title = capitalize(title) + " - DGTTM | SIGEPeC";
}
export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const getCookie = (cname) => {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) === 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
}
  
const checkCookie  = (cname) => {
    let auth = getCookie(cname);
    if(auth === ""){
        return false
    }
    return true
}

export const isLoggin = (cname) => {
    if(checkCookie(cname)){
        return getCookie(cname)
    }
    
    return ""
}

export const removeToken = (cname) => {
    if(checkCookie(cname)){
        setCookie(cname,"", 0)
        return 
    }

}

export const toArray = (string, separator = ";") => {
    let tabs = string.split(separator)
    return tabs.filter(el => el !== " " || el !== null)
}