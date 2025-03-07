export interface Company {
  createdAt: string;
  description: string;
  id: string;
  name: string;
  sector: string;
  updatedAt: string;
}

export interface ProductsAndServices {
  id: number;
  name: string;
  description: string;
  sector: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  position: string;
  isAccepted: boolean;
}
