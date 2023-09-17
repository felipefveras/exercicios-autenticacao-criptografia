const express = require('express')
const { cadastrarUsuario, obterPerfil, login } = require('./controladores/usuarios')
const { listarTodosPokemons } = require('./controladores/pokemons')
const verificarUsuarioLogado = require('./intermediarios/autenticacao')


const rotas = express()


rotas.post('/usuario', cadastrarUsuario)

rotas.get('/login', login)
rotas.use(verificarUsuarioLogado)
rotas.get('/pokemons', listarTodosPokemons)


module.exports = rotas