const pool = require('../conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const cadastrarUsuario = async function (req, res) {
    const { nome, email, senha } = req.body

    if (!nome || !email || !senha) {
        return res.status(400).json({ mensagem: 'todos os campos são obrigatórios!' })
    }

    try {

        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const novoUsuario = await pool.query("insert into usuarios (nome, email, senha) values ($1, $2, $3) returning *",
            [nome, email, senhaCriptografada])

        return res.json({ mensagem: "usuário cadastrado" })
    } catch (error) {
        return res.json({ mensagem: "erro no servidor" })
    }
}

const login = async function (req, res) {
    const { email, senha } = req.body

    try {
        const usuario = await pool.query('select * from usuarios where email = $1', [email])

        if (usuario.rowCount < 1) {
            return res.status(404).json({ mensagem: "usuário não encontrado" })
        }

        const senhaValida = await bcrypt.compare(senha, usuario.rows[0].senha)

        if (!senhaValida) {
            return res.status(400).json({ mensagem: "senha ou email incorretos" })
        }

        const token = jwt.sign({ id: usuario.rows[0].id }, senha, { expiresIn: '8h' })
        console.log(token)
        const { senha: _, ...usuarioLogado } = usuario.rows[0]

        return res.json({ usuario: usuarioLogado, token })
    } catch (error) {
        return res.status(500).json({ mensagem: "erro no servidor" })
    }
}

const obterPerfil = async function (req, res) {
    return res.json(req.usuario)
}

module.exports = { cadastrarUsuario, login, obterPerfil }