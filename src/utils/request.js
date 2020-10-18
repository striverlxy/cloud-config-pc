import 'whatwg-fetch';
import fetchJsonp from 'fetch-jsonp'
import { message } from 'antd'
import localStorage from './localStorage'

export default class request {
	static option = {
		headers: {
			'Content-Type': 'application/json',
			Accept: '*/*'
		}
    }
    
    static API_HOST = 'http://localhost:9999'

    static SUCCESS_CODE = '000000'

	static buildUrl(url, params) {
		if (Object.keys(params).length == 0) return url;
		let result = request.getParamsArray(params);
		let prefix = '?';
		if (url.indexOf('?') > -1) {
			prefix = '&';
		}

		return url + prefix + result.join('&');
	}

	static getParamsArray(params) {
		let result = new Array();
		if (Object.keys(params).length == 0) return result;
		Object.keys(params).forEach(key => {
			if (params.hasOwnProperty(key)) {
				result.push(key + '=' + params[key]);
			}
		});
		return result;
	}

	static optResponse(res) {
		if (res.ok && res.status === 200) {
			return res.json();
		} else {
			message.warn('错误的请求！');
		}
	}

	static getOpt() {
		let _opt = request.option;
        if (localStorage.getItem(localStorage.keyMap.ACCESS_TOKEN)) {
            _opt.headers.Authorization = localStorage.getItem(localStorage.keyMap.ACCESS_TOKEN)
		}
		return _opt
	}

	static get(url, params = {}) {
        let _opt = request.getOpt()
		_opt.headers['Content-Type'] = 'application/json';
		_opt.method = 'GET';
		if (_opt.body) {
			delete _opt.body
		}
		url = request.buildUrl(url, params);

        return new Promise((resolve, reject) => {
            fetch(request.API_HOST + url, _opt)
			.then(res => {
				return request.optResponse(res);
			})
			.then(data => {
				if (data.code == request.SUCCESS_CODE) {
					resolve(data.data);
				} else {
					message.info(data.msg);
				}
			})
			.catch(e => {
				if (e instanceof Error) {
					console.log(e.message);
				}

				if (e.message === 'Failed to fetch') {
					message.error('网络异常，请稍候再试');
				}
			});
        })
	}

	static getQQMapData(url, params = {}) {
        let _opt = {}
		_opt.method = 'GET';
		_opt.mode = 'no-cors'

		//拼装qqmap参数
		params.key = 'O7GBZ-P7GKX-DBT4Q-7CFKN-JL2NJ-NWBG2'
		params.output = 'jsonp'

		url = request.buildUrl(url, params);

        return new Promise((resolve, reject) => {
			fetchJsonp(url, {
				timeout: 3000,
				jsonpCallback: 'callback'
			})
				.then(data => {
					return data.json()
				})
				.then(data => {
					if (data.status == '0' && data.message == 'query ok') {
						resolve(data.result);
					} else {
						message.info(data.msg);
					}
				})
				.catch(err => {
					console.log(err);
				})
        })
	}

	static post(url, params) {
		let _opt = request.getOpt()
		_opt.method = 'POST';
		_opt.body = JSON.stringify(params);

		url = request.API_HOST + url;

        return new Promise((resolve, reject) => {
            fetch(url, _opt)
			.then(res => {
				return request.optResponse(res);
			})
			.then(data => {
				if (data.code == request.SUCCESS_CODE) {
					resolve(data.data);
				} else {
					message.info(data.msg);
				}
			})
			.catch(e => {
				if (e instanceof Error) {
					console.log(e.message);
				}

				if (e.message === 'Failed to fetch') {
					message.error('网络异常，请稍候再试');
				}
			});
        })
	}
}