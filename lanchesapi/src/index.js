const express = require("express")
const cors = require("cors")
const server = express()
server.use(express.json())
server.use(cors())

server.get("/test", (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const AlunoRoutes = require('./routes/AlunoRoutes');
const LancheRoutes = require('./routes/LancheRoutes');
server.use('/aluno', AlunoRoutes);
server.use('/lanche', LancheRoutes);

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000")
})