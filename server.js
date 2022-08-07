const express = require('express');
const cors = require('cors');
const app = express();
const models = require('./models');
const product = require('./models/product');
const port = 8080;

app.use(express.json());
app.use(cors());

app.get("/products",(req,res) => {

    models.product.findAll({
      
      order : [['createdAt', 'DESC']],
      attributes: ['id','name','price','createdAt','seller','imageUrl'],

    }).then((result)=> {
      console.log("PRODUCTS : ", result);
      res.send({
        products : result
      })
    }).catch((error) => {
      console.error(error);
      res.send("에러발생");
    })

    
});

app.post("/products",(req,res) => {
    const body = req.body;
    const {name, description, price, seller} = body;

    if(!name || !description || !price || !seller){
      res.send("모든 필드를 입력해주세요");
    }

    models.product.create({
      name,
      description,
      price,
      seller
    }).then((result)=>{
      console.log("상품생성 결과 : ",result);
      res.send({
        result,
      });
    }).catch((error)=>{
      console.error(error);
      res.send("상품업로드에 문제가 발생했습니다.")
    });
});

app.get("/products/:id", (req,res) => {
  const params = req.params;
  const {id} = params;
  models.product.findOne({
    where : {
      id : id
    }
  }).then((result) => {
    console.log("PRODUCT : ", result);
    res.send({
      product : result
    })
  }).catch((error) => {
    console.error(error);
    res.send("상품 조회에 에러가 발생했습니다.");
  })
})

app.listen(port, () => {
    console.log("그랩의 쇼핑몰 서버가 돌아가고 있습니다.");
    models.sequelize.sync().then(() => {
      console.log('DB연결 성공!')
    }).catch(()=>{
      console.log(err);
      console.log('DB연결 에러');
      process.exit();
    })
});
