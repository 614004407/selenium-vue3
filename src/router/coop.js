//引入express模块
const express = require('express');
//创建路由对象
const pool = require('../pool');
//引入数据库连接池
const router = express.Router();
//post请求 /add 提交留言接口 请求地址 /v1/coop/add
//一般增加也就是插入新的内容用post比较安全不会暴露用户信息
//req是请求 res响应请求
//next是下一个的意思 express中的一个方法把错误发送到错误处理的代码块中
router.post('/add',(req,res,next)=>{
  //获取传递过来的参数体
  let obj = req.body;
  //向参数体内添加当前时间，本数据库需要，不要的可以直接删除
  obj.ctime = Date.now();
  console.log(obj);
  //向数据库发送请求 set是自动和传递参数进行匹配，匹配不到的为默认值null
  pool.query('insert into ht_cooperate set ?'),[obj],(err,req)=>{
    if (err) {
      //这个地方是把错误返回到app.js最后的代码块处理错误
      return next(err)
    }
    res.send({ code: 200, msg: '留言成功' })
  }
});
//修改留言信息  put /update 修改一般用put请求
router.put('/update', (req, res, next) => {
  let obj = req.body;
  //向参数体内添加当前时间，本数据库需要，不要的可以直接删除
  obj.ctime = Date.now();
  console.log(obj);
  pool.query('update ht_cooperate set ? where cid=?', [obj,obj.cid], (err, req) => {
    //这是es6写法当{}只有一句代码时可以省略{}
    if (err) return next(err);
    console.log(req);
    //changedRows是判断是否修改为0的时候表示没修改，为1便是修改
    if (req.changedRows === 0) {
      res.send({ code: 400, msg: '失败' })
    } else {
      res.send({ code: 200, msg: '成功', data: req })
    }
  })
})
//删除留言 删除一般用get 速度块
router.get('/delete', (req, res, next) => {
  let obj = req.query;
  console.log(obj);
  pool.query('delete from ht_cooperate where cid=?', [obj.cid], (err, req) => {
    if (err) return next(err);
    console.log(req);
    //affectedRows是判断是否删除为0的时候表示没删除，为1便是删除
    if (req.affectedRows === 0) {
      res.send({ code: 400, msg: '失败' })
    } else {
      res.send({ code: 200, msg: '成功', data: req })
    }
  })
})
//以上便是接口中的增删改。
