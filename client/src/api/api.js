import Axios from '../Axios'

export const getAllInterviews = () => {
    return Axios
      .get('/interview/all')
      .then(response => {
        return response.data
      })
      .catch(err => {
        console.log(err)
      })
}

export const getSingleInterview = id => {
    return Axios
     .get(`/interview/all/${id}`)
     .then(response => {
       return response.data
     })
     .catch(err => {
       console.log(err)
     })
 }