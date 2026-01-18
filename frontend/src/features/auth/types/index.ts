export type LoginCredentialsDTO = {
    email: string;
    password: string;
}


export type RegisterCredentialsDTO = {
  email: string;
  name: string;
  password: string;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
}