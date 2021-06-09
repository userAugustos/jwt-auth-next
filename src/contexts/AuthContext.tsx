import { createContext, useEffect, useState } from "react";
import { recoverUserInformation, signInRequest } from "../services/auth";
import { setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from "../services/api";

type SignInData = {
  email: string,
  password: string
}

type User = {
  name: string;
  email: string;
  avatar_url: string;
}

type AuthContexType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>; //passando que a nossa função signIn recebe dados que são do tipo SignInData e ela é uma promise q não retorna nada
}


export const AuthContext = createContext({} as AuthContexType ); //melhor forma de passar tipagem para um context(Contextapi)

export function AuthProvider({children }){
  const [ user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => { //criando um side effect pra sempre que encontrarmos o token na pagina, irmos no backend buscar as informações do usuario
    const { ['auth.token']: token } = parseCookies(); //isso é uma desestruturação, veja a baixo como seria da forma padrão
 // const token = cookies['auth.token'];

    if(token){
      recoverUserInformation().then(response => setUser(response.user));
    }
  }, [])

  async function signIn({ email, password }: SignInData) { //pegando o email e password validados, e também já passando eles pro auth.ts
    const { token, user } = await signInRequest({ //recebendo as informações do auth.ts no meu context
      email,
      password
    });

    setCookie( //salvando nos cookis o token que recebemos do auth
      undefined, //este é pra se realmente teivessemos rodando algo no next (servidor do SSR)
      'auth.token', //nome do token
      token, //token :)
      {
        maxAge: 60 * 60 * 2, // aqui to passando quanto tempo maximo o cookie vai persistir, como é em segundos, estou fazendo 60s * 60(1 hora) e * 2 o que resulta em = 2 horas
      }
    ); 

    api.defaults.headers['Authorization'] = `Bearer ${token}`; //sobreescrevendo a autenticação de token, pra executarmos sempre que o usuario fazer o signIn

    setUser(user); //definindo num estado as informações do usuario, não salvo nos cookis pq não quero que elas sejam permanentes, quero que elas sejam atualizadas

    Router.push('/dashboard');
  }

  return(
    <AuthContext.Provider  value={{ user, isAuthenticated, signIn  }} >
      {children}
    </AuthContext.Provider>
  )
}