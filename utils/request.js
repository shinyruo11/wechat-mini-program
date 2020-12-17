const baseURL = 'https://api-hmugo-web.itheima.net/api/public/v1';
function request(url, method, data) {
    return new Promise(function(resolve, reject) {
        uni.request({
            url: baseURL + url,
            method: method,
            data:data,
            success(res) {
                //请求成功
				 resolve(res);
            },
            fail(err) {
                //请求失败
                reject(err)
            }
        })
    })
}
module.exports = {
	request:request
}