import axios from 'axios'
import jwt_decode from 'jwt-decode';

const refreshToken = async () => {
    var secret = JSON.parse(localStorage.getItem('secret'))
    if( secret ){
        const exp = jwt_decode(secret.access_token).exp
        if( exp < new Date().getTime()/1000){
      		var res = await axios.get(`/user/me_access`,  {
              	headers: { 
                    'x-refresh-token': secret.refresh_token,
                }
      	    })
            .catch( err => { return true})
      		if(res && res.data !== undefined){  
              if( res.data.access_token !== undefined){
                localStorage.setItem('secret', JSON.stringify(res.data))
              }
          }
        }
    }
}

export default refreshToken