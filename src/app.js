//引入express模块
const express=require('express');
//创建web服务器
const app=express();
//引入coop路由对象
const coop=require('./routes/coop')
//设置接口响应用户
app.listen(3000,()=>{
  console.log('服务器已经启动')
})
//用于使用post请求时进行传递的参数转化为对象
app.use(express.urlencoded({extended:true}));
//挂载我们引入的路由对象模块
//'/v1/coop这是前缀为了给自己的接口进行分类，发送请求时别忘记加上
//127.0.0.1：3000/'/v1/coop/
app.use('/v1/coop',coop);
//在所有的路由后面添加错误处理中间件，拦截所有的错误，拦截错误好几种这种复用比较防弊
app.use((err,req,res,next)=>{
  // err 接收路由中传递的错误信息
  console.log(err);
  //响应给客户端的错误信息
  res.send({
    code:500,
    msg:'服务器内部错误'
  })
})
