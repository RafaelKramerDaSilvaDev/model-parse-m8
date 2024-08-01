export class Person extends Mapper {
  mappingFields = {
    'supplier.id': 'FornecedorId',
    'supplier.name': 'FornecedorNome',

    'name': 'Nome',
    'birthday': 'Aniversario',
    'height': 'Altura',
    'initial': 'Inicial',
    'wage': 'Salario',
    'balance': 'Saldo',
    'distance': 'Distancia',
    'age': 'Idade',
    'address': 'Endereco',
    'city': 'Cidade',
    'state': 'Estado',
    'country': 'Pais',
    'zipcode': 'CEP',
    'telephone': 'Telefone',
    'isAdmin': 'IsAdmin',
    'levelAccess': 'NivelAcesso',
  }

  supplier?: select2;

  height?: number;
  wage?: number;
  balance?: number;
  distance?: number;
  age?: number;
  levelAccess?: number;

  name?: string;
  initial?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  telephone?: string;

  birthday?: Date;

  isAdmin?: boolean;
}
