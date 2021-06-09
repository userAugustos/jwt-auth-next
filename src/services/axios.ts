import axios from 'axios';
import { parseCookies } from 'nookies';

//iniciando uma simples logica de api com axios

export function getApiClient(ctx?: any) {

  const { ['auth.token']: token } = parseCookies(ctx);

  const api = axios.create({
    baseURL: 'htpp://localhost:3000'
  });


  api.interceptors.request.use(config => { //esse código é só pq não temos uma api realmente, então estamos barrando a requisição a api e vendo o config que estamos enviando
    console.log(config);

    return config;
  })

  if(token){ //autenticação jwt com axios
    api.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}