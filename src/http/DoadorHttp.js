const axios = require('axios');

//const API_HOST = "https://desafio-cleiton-duarte.herokuapp.com/pessoas";
const API_HOST = "http://localhost:8080/pessoas";

export default {
  async buscarTodos() {
    return axios.get(API_HOST)
      .then((resposta) => resposta);
  },
  async deletar(id) {
    return axios.delete(`${API_HOST}/${id}`, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    })
      .then((resposta) => resposta);
  },
  async atualizar(id, obj) {
    return axios.put(`${API_HOST}/${id}`, obj, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    }
    )
      .then((resposta) => resposta);
  },
  async inserir( obj) {
    return axios.post(API_HOST, obj, {
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
      }
    }
    )
      .then((resposta) => resposta);
  },
}