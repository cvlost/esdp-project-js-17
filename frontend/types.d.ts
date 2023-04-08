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
