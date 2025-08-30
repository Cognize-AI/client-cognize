export type ListType = {
  id: number;
  name: string;
  color: string;
  list_order: number;
  created_at: string;
  updated_at: string;
  cards: CardType[];
};

export type CardType = {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  image_url: string;
  list_id: number;
  created_at: string;
  updated_at: string;
  tags: {
    id: number
    name: string
    color: string
  }[];
};

export type SelectedCard = CardType & {
  list_name: string; 
}

export type User = {
  id: number;
  name: string;
  email: string;
  profilePicture: string;
};

export type Tag = {
  id: number;
  name: string;
  color: string;
}

export type Card = {
  id: number;
  name: string;
  designation: string;
  email: string;
  phone: string;
  image_url: string;
  list_id: number;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export type Item = {
  id: number;
  text: string;
}
export type List = {
  id: number;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
  cards: Card[];
}

export type CompanyData = {
  name: string
  role: string
  location: string
  phone: string
  email: string
}

export interface CardByIdData {
  id: number
  name: string
  designation: string
  email: string
  phone: string
  image_url: string
  location: string
  ListID: number
  CardOrder: number
  activity: {
    id: number
    content: string
    created_at: string
  }[]
  tags: {
    id: number
    name: string
    color: string
  }[]
  list_name: string
  list_color: string
  company: {
    name: string
    role: string
    location: string
    phone: string
    email: string
  }
  additional_contact: {
    id: number
    name: string
    value: string
    data_type: string
  }[]
  additional_company: {
    id: number
    name: string
    value: string
    data_type: string
  }[]
}