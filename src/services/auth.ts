// esse aquivo vai simular as querys do backend
import { v4 as uuid } from 'uuid';


type SignInRequestData = {
  email: string,
  password: string
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount));

export async function signInRequest(data: SignInRequestData){
  await delay();

   return{
      token: uuid(), //aqui simulando um retorno do backend, vamo retornar o token e algumas inforamções do usuario
      user: {
        name: "Felipe Augustos",
        email: "felipe@guasto.com.br",
        avatar_url: "https://github.com/userAugustos.png"
      }
   }
}

export async function recoverUserInformation() { //essa função é pra simular que com o token o backend ta indo buscar as inforamções do usuario, precisariamos receber um token como parametro
  await delay();

  return{
    user: {
      name: "Felipe Augustos",
      email: "felipe@guasto.com.br",
      avatar_url: "https://github.com/userAugustos.png"
    }
  }
}