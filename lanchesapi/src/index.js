const express = require("express")
const cors = require("cors")
const server = express()
server.use(express.json({ limit: '50mb' }))
server.use(express.urlencoded({ limit: '50mb', extended: true }))
server.use(cors())

server.get("/test", (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const AlunoRoutes = require('./routes/AlunoRoutes');
const LancheRoutes = require('./routes/LancheRoutes');
server.use('/aluno', AlunoRoutes);
server.use('/lanche', LancheRoutes);

server.listen(3000, '0.0.0.0', () => {
  console.log("Server is running on http://0.0.0.0:3000")
  console.log("Also accessible via:")
  console.log("  - http://localhost:3000")
  console.log("  - http://192.168.15.37:3000")
  console.log("  - http://10.0.2.2:3000 (Android Emulator)")
})