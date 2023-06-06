import axios from "axios";
import { APIURL } from "../../utils/constant";
import { removeToken, setCookie } from "../../utils/sharedFunction";

const login = async (data) => {
    const response = await axios.post(APIURL + "authentifications/token/token_obtain/", data)
   
    if (response.data) {
        let obj = {
            user_slug: response.data.user_slug
        }
        const response1 = await axios.post(APIURL + "examinateurs/get_info_examinateur/", obj)
        if(response1.data){
          
            setCookie("auth-exam",response.data.token, 10)
            let stk = {
                change_password: response.data.change_password,
                user_slug: response.data.user_slug,
            }
            localStorage.setItem('auth-exam-user', JSON.stringify(stk))
            localStorage.setItem('auth-exam-examinateur', JSON.stringify(response1.data.examinateur.id))

            return 
        }
    }
}

const me = async (data, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    
    const response = await axios.get(APIURL + `authentifications/users/${data}/`, token)
    
    return response.data
}

const updateInfos = async (data, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    let obj = {
        nom: data.nom,
        prenom: data.prenom,
        service: data.service,
        telephone: data.telephone,
        numero_matricule: data.numero_matricule,
        email: data.email,
    }
    const response = await axios.patch(APIURL + `authentifications/users/${data.slug}/`, obj, config)
    
    return response.data
}

const updatePassword = async (data, token) => {
    const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
    }
    let obj = {
        old_password: data.old_password,
        new_password: data.new_password,
        confirm_new_password: data.confirm_new_password
    }
    const response = await axios.post(APIURL + `authentifications/users/${data.slug}/user_change_password/`,obj, config)
    return response.data
}

const logout = async () => {
    removeToken("auth-exam")
    localStorage.removeItem('auth-exam-user')
    localStorage.removeItem('auth-exam-examinateur')
}

const authService = {
    login,
    me,
    logout,
    updateInfos,
    updatePassword
}

export default authService
