import axios from 'axios'

const refreshToken = async () => {
    var secret = JSON.parse(localStorage.getItem('secret'))
    if( secret ){
  		var res = await axios.get(`/check_token`,  {
          	headers: { 
                'x-refresh-token': secret.refresh_token,
                'x-access-token': secret.access_token
            }
  	    })
        .catch( err => { return true})
  		if(res && res.data.rs.access_token !== undefined){  
            localStorage.setItem('secret', JSON.stringify(res.data))
        }
    }
}

export default refreshToken