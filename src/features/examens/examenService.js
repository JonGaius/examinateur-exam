import axios from "axios";
import { APIURL } from "../../utils/constant";

const getTodayExams = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.post(APIURL + `gestion_examen/examens/get_examen_examinateur_du_jour/`, data)
    // console.log(response.data)
    return response.data
}

const getSujets = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.post(APIURL + `gestion_examen/sujets/get_sujet_examen/`, data)
    
    if(response.data && response.data.sujet){
        let obj = {
            question: response.data.sujet.questions_choisies
        }
        const responses = await axios.post(APIURL + `questionnaires/questions/get_question/`, obj)
        let obe = {
            sujet: response.data.sujet,
            questions: responses.data.message
        }
        return obe
    }
}

const getMyPrograms = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.post(APIURL + `gestion_examen/examens/get_examen_examinateur/`, data)
    console.log(response)
    return response.data.examens_du_jour
}

const getExam = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.get(APIURL + `gestion_examen/examens/${data}/`)
    
    return response.data
}

const getExams = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.post(APIURL + `examinateurs/etat_examinateur/`, data)
    // console.log(response)
    return response.data.examens
}

const updateExam = async (data, token) => {
    // const config = {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    // }
    
    const response = await axios.patch(APIURL + `gestion_examen/examens/${data.id}/`, data.content)
    console.log(response)
    return response.data
}
const examenService = {
    getMyPrograms,
    getExam,
    getTodayExams,
    getSujets,
    updateExam,
    getExams
}

export default examenService