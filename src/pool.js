//引入mysql
const mysql=require('mysql');
//创建数据库连接池
const pool=mysql.createPool({
  host:'127.0.0.1',
  port:'3306',
  user:'root',
  password:'123456',
  database:'hantang',
  connectionLimit:15,//数据库一次最大连接数量，如果不写就默认15
  multipleStatements:true//这时允许一次发送多条sql命令
})
//暴露连接池，让其他文件使用
module.exports=pool;
