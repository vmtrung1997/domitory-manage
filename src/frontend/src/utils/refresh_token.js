import axios from 'axios'

const refreshToken = async () => {
  console.log('==refresh token')
    var secret = JSON.parse(localStorage.getItem('secret'))
    if( secret ){
  		var res = await axios.get(`/check_token`,  {
          	headers: { 
                'x-refresh-token': secret.refresh_token,
                'x-access-token': secret.access_token
            }
  	    })
        .catch( err => {})
  		if(res && res.data !== undefined){  
            localStorage.setItem('secret', JSON.stringify(res.data))
        }
    }
  console.log('==refresh token end')

}

export default refreshToken