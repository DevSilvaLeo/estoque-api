# Ajustes das Models para Integração com Frontend

Este documento descreve as alterações realizadas nas models da API para facilitar a integração com as interfaces do frontend.

## Resumo das Alterações

### 1. Model Item (`src/models/Item.js`)
**Campos ajustados:**
- `name` → `nome`
- `departmentId` → `departamentoId`
- `supplierId` → `fornecedorId`
- `unitPrice` → `valorUnitario`
- `validUntil` → `validade`
- `restriction` → `restricoes`
- `itemType` → `tipoItem` (agora é ENUM com valores: PRODUTO, MATERIAL, EQUIPAMENTO, FERRAMENTA, OUTROS)
- `quantityOnHand` → `quantidadeAtual`

**Novos campos adicionados:**
- `dataCadastro` (DATE, não nulo, padrão: NOW)
- `ativo` (BOOLEAN, não nulo, padrão: true)

### 2. Model Department (`src/models/Department.js`)
**Campos ajustados:**
- `name` → `nome`
- `description` → `descricao`

### 3. Model Supplier (`src/models/Supplier.js`)
**Campos ajustados:**
- `name` → `nome`
- `contactEmail` → `email`
- `phone` → `telefone`

**Novos campos adicionados:**
- `contato` (STRING(120), opcional)

**Campos removidos:**
- `document` (removido para simplificar)

### 4. Model Transaction (`src/models/Transaction.js`)
**Campos ajustados:**
- `quantity` → `quantidade`
- `action` → `tipo` (agora ENUM com valores: ENTRADA, SAIDA)
- `when` → `data`
- `note` → `observacoes`

**Novos campos adicionados:**
- `itemNome` (STRING(200), não nulo) - para facilitar consultas
- `responsavel` (STRING(120), não nulo)
- `valorUnitario` (DECIMAL(12,2), opcional)
- `valorTotal` (DECIMAL(12,2), opcional)

### 5. Model User (`src/models/User.js`)
**Campos ajustados:**
- `name` → `nome`
- `passwordHash` → `senha`
- `role` → `perfil`
- `isActive` → `ativo`

**Novos campos adicionados:**
- `dataCadastro` (DATE, não nulo, padrão: NOW)

**Perfis de usuário atualizados:**
- ADMIN
- OPERADOR (novo)
- VISUALIZADOR (novo)
- Removido: MANAGER, USER

### 6. Relacionamentos (`src/models/index.js`)
**Relacionamentos atualizados com aliases em português:**
- `Department` ↔ `Item`: `departamento` ↔ `itens`
- `Supplier` ↔ `Item`: `fornecedor` ↔ `itens`
- `User` ↔ `Transaction`: `usuario` ↔ `movimentacoes`
- `Item` ↔ `Transaction`: `item` ↔ `movimentacoes`

## Correspondência com Interfaces do Frontend

### Item Interface
```typescript
export interface Item {
  id: string;
  nome: string;
  departamento: string;        // Nome do departamento (via relacionamento)
  fornecedor: string;          // Nome do fornecedor (via relacionamento)
  valorUnitario?: number;
  validade?: Date;
  restricoes?: string;
  tipoItem: TipoItem;
  quantidadeAtual: number;
  dataCadastro: Date;
  ativo: boolean;
}
```

### Departamento Interface
```typescript
export interface Departamento {
  id: string;
  nome: string;
  descricao?: string;
}
```

### Fornecedor Interface
```typescript
export interface Fornecedor {
  id: string;
  nome: string;
  contato?: string;
  telefone?: string;
  email?: string;
}
```

### Movimentacao Interface
```typescript
export interface Movimentacao {
  id: string;
  itemId: string;
  itemNome: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  data: Date;
  responsavel: string;
  observacoes?: string;
  valorUnitario?: number;
  valorTotal?: number;
}
```

### Usuario Interface
```typescript
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  perfil: PerfilUsuario;
  ativo: boolean;
  dataCadastro: Date;
}
```

## Enums Correspondentes

### TipoItem
```typescript
export enum TipoItem {
  PRODUTO = 'PRODUTO',
  MATERIAL = 'MATERIAL',
  EQUIPAMENTO = 'EQUIPAMENTO',
  FERRAMENTA = 'FERRAMENTA',
  OUTROS = 'OUTROS'
}
```

### TipoMovimentacao
```typescript
export enum TipoMovimentacao {
  ENTRADA = 'ENTRADA',
  SAIDA = 'SAIDA'
}
```

### PerfilUsuario
```typescript
export enum PerfilUsuario {
  ADMIN = 'ADMIN',
  OPERADOR = 'OPERADOR',
  VISUALIZADOR = 'VISUALIZADOR'
}
```

## Próximos Passos

1. **Atualizar Controllers**: Os controllers precisarão ser atualizados para usar os novos nomes dos campos
2. **Atualizar Rotas**: As rotas podem precisar de ajustes para retornar os dados no formato correto
3. **Migração do Banco**: Será necessário criar uma migração para renomear as colunas no banco de dados
4. **Testes**: Atualizar os testes para refletir as mudanças nas models

## Exemplo de Uso com Relacionamentos

```javascript
// Buscar item com departamento e fornecedor
const item = await Item.findByPk(1, {
  include: [
    { model: Department, as: 'departamento' },
    { model: Supplier, as: 'fornecedor' }
  ]
});

// Buscar movimentações de um item
const movimentacoes = await Transaction.findAll({
  where: { itemId: 1 },
  include: [
    { model: User, as: 'usuario' },
    { model: Item, as: 'item' }
  ]
});
```
