import axios from 'axios'

const refreshToken = async () => {
    var secret = JSON.parse(localStorage.getItem('secret'))
    if( secret ){
    	await axios.get('/check_token',{
			headers: { 'x-access-token': secret.access_token}
		})
    	.catch( async err => {
    		var res = await axios.get(`/user/me_access`,  {
	        	headers: { 'x-refresh-token': secret.refresh_token }
		    })
            .catch( err => {})
			if(res && res.data !== undefined)
                localStorage.setItem('secret', JSON.stringify(res.data))
    	})
    }
}

export default refreshToken