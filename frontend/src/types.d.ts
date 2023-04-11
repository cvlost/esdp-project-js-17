export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
  role: string;
}
export interface LoginMutation {
  email: string;
  password: string;
}

export interface UserResponse {
  message: string;
  user: User;
}

export interface RegisterMutation {
  email: string;
  password: string;
  role: 'admin' | 'user' | '';
  displayName: string;
}

export interface IRole {
  prettyName: string;
  name: string;
}

export interface ValidationError {
  errors: {
    [key: string]: {
      message: string;
      name: string;
    };
  };
  message: string;
  name: string;
  _name: string;
}

export interface GlobalError {
  error: string;
}
