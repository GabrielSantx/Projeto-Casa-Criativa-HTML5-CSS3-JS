const express = require("express")
const server = express()

const db = require("./db")

  //const ideas = [
    //{
       // img: "https://image.flaticon.com/icons/svg/2729/2729007.svg",
       // title: "Cursos de Programação",
      //  category: "Estudo",
     //   description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
       // url: "https://digitalinnovation.one/"
  //  },

   // {
    //    img: "https://image.flaticon.com/icons/svg/2729/2729005.svg",
     //   title: "Exercícios",
       // category: "Saúde",
    //    description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
      //  url: "https://www.minhavida.com.br/fitness/noticias/35883-10-exercicios-fisicos-faceis-para-fazer-a-qualquer-hora"
   // },

   // {
     //   img: "https://image.flaticon.com/icons/svg/2729/2729027.svg",
       // title: "Meditação",
     //   category: "Mentalidade",
       // description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
      //  url: "https://www.minhavida.com.br/bem-estar/tudo-sobre/1042-meditacao"
   // },

  //  {
     //   img: "https://image.flaticon.com/icons/svg/2726/2726270.svg",
     // title: "Músicas",
      //  category: "Entretenimento",
      //  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
     //   url: "https://music.youtube.com/"
 // },

   //{
      //  img: "https://image.flaticon.com/icons/svg/2729/2729042.svg",
       // title: "Filmes e Séries",
      //  category: "Entretenimento",
      //  description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
       // url: "http://www.superflix.net/categoria/assistir-filmes-de-acao-online/"
   // },

   // {
        //img: "https://image.flaticon.com/icons/svg/2729/2729021.svg",
       // title: "Jogos",
        //category: "Diversão",
        //description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit ipsa recusandae odio modi cumque ratione at beatae, repellat perferendis possimus adipisci, suscipit ex magni porro, inventore obcaecati voluptatum autem a!",
       // url: "https://store.steampowered.com/genre/Free%20to%20Play/"
   // },
 //]

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("views", {
    express: server,
    noCache: true,
})

server.get("/", function(req, res) {

    db.all(`SELECT * FROM ideas`, function(err, rows) {
      if (err) {
        console.log(err)
        return res.send("Erro no Banco de Dados")
      }   
   
           const reversedIdeas = [...rows].reverse()
           let lastIdeas = []
           for (let idea of reversedIdeas) {
               if(lastIdeas.length < 3) {
                   lastIdeas.push(idea)
               }
           }
       
           return res.render("index.html", { ideas: lastIdeas })  
       })
})

server.get("/ideias", function(req, res) {
    
    

    db.all(`SELECT * FROM ideas`, function(err, rows) {
      if (err) {
        console.log(err)
        return res.send("Erro no Banco de Dados")
      }   

        const reversedIdeas = [...rows].reverse()
        return res.render("ideias.html", { ideas: reversedIdeas})        
  })

})

server.post("/", function(req, res) {
  const { image, title, category, description, link } = req.body;
        const query = `
        INSERT INTO ideas(
            image,
            title,
            category,
            description,
            link
        ) VALUES(?,?,?,?,?); 
        `       
     
        const values = [
          image, 
          title, 
          category, 
          description, 
          link
        ];


     db.run(query, values, function(err) {
      if (err) {
        console.log(err)
        return res.send("Erro no Banco de Dados")
      }   

      return res.redirect("/ideias")
     })
})

server.listen(3333)

