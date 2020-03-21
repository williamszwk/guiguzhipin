import axios from 'axios'

export default function ajax(url='',data={},type='GET'){
    if (type === 'GET'){
        let dataStr = ''
        Object.keys(data).forEach(key=>{    //获取data的每个索引
            dataStr+=key+'='+data[key]+'&'
        })
        if (dataStr !== ''){        //多一个&，去掉
            dataStr = dataStr.substring(0, dataStr.lastIndexOf('&'))
            url = url + '?' + dataStr
        }
        return axios.get(url)
    }
    else{
        return axios.post(url, data)
    }
}