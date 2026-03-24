export interface RegisterData {
  username: string;
  password: string;
  email?: string;
  role: 'medic' | 'patient';
  birth_date?: string;  // добавить знак вопроса, сделать необязательным
  name?: string;        // тоже добавить, если нужно
  sex?: string;
}

export interface RegisterResponse {
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
    birth_date: '';
  };
  message: string;
}