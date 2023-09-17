const pool = require('../conexao')
const senhaJwt = require('../senhaJwt')


const listarTodosPokemons = async function (req, res) {
    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: 'não autorizado' })
    }

    const token = authorization.split(' ')[1]

    try {
        const tokenUsuario = jwt.verify(token, senhaJwt)
        const { rows } = await pool.query('select * from catalogo_pokemons')

        return res.json(rows)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const listarUmPokemon = async function (req, res) {
    const { authorization } = req.headers

    const { id } = req.query

    if (!id || Number(id) <= 0) {
        return res.status(401).json({ mensagem: 'id inválido ou em branco' })
    }
    if (!authorization) {
        return res.status(401).json({ mensagem: 'não autorizado' })
    }

    const token = authorization.split(' ')[1]


    try {
        const tokenUsuario = jwt.verify(token, senhaJwt)
        const { rows } = await pool.query('select * from catalogo_pokemons where id = $1', [id])

        return res.json(rows)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }
}

const cadastrarPokemon = async function (req, res) {
    const { authorization } = req.headers
    const { nome, habilidades } = req.body

    if (!nome || !habilidades)
        if (!authorization) {
            return res.status(401).json({ mensagem: 'não autorizado' })
        }

    const token = authorization.split(' ')[1]
    console.log(token)
    try {
        const tokenUsuario = jwt.verify(token, senhaJwt)

        const { rows } = await pool.query(`insert into pokemons (usuario_id, nome, habilidades) 
        values ($1, $2, $3)`, [token, nome, habilidades])

        return res.json(rows)
    } catch (error) {
        return res.status(500).json('Erro interno do servidor')
    }

}

module.exports = { listarTodosPokemons, listarUmPokemon, cadastrarPokemon, }