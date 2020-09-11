
const http = require('../utils/http')
const base = require('../utils/base')
const cache = require('../utils/cache')
const config = require('../config')
const host = base.base64_decode(require('../config').host.nrop19)

const data = {
  async list(page , cate){
    let resp = await http.get(host+'v.php?page='+page+'&category='+cate)
    let data = []
    resp.replace(/viewkey=([0-9a-z]+)[^<]+?\s*<img\s+src="([^"]+?)"[\w\W]+?title="([^"]+?)"/g , ($0 , $1, $2, $3)=>{
      data.push({
        viewkey : $1 , 
        thumb : $2.replace(/http:/,'https:') ,
        img : $2.replace(/http:/,'https:').replace(/\d+_/,''),
        title : $3
      })
      return ''
    })
    return data
  },

  async detail(viewkey){
    if(cache(viewkey)){
      return cache(viewkey)
    }

    let resp = await http.get('http://n.t9k.space/view_video.php?viewkey='+viewkey , {fake:true})

    let url = (resp.match(/source\s*src\s*=\s*([^ ]+)/) || ['',''])[1]

    let thumb = (resp.match(/poster\s*=\s*"([^"]+)/) || ['',''])[1]

    let title =(resp.match(/demo-desc">([^<]+)/) || ['',''])[1].replace(/[\r\n\s]/g,'')  

    let source = [{
      title :'默认',
      url : url
    }]
    cache(viewkey , { title , source, thumb})

    return { title , source, thumb}
  },


}

module.exports = data
