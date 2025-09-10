# Guia de Migração - Atualização das Models

## Problema
Após atualizar as models para usar nomes em português, o banco de dados ainda possui as colunas com nomes em inglês, causando o erro:
```
Failed to start server: Unknown column 'nome' in 'field list'
```

## Soluções

### Opção 1: Migração Manual (Recomendada para Produção)

1. **Execute a migração SQL:**
   ```bash
   npm run migrate
   ```

2. **Remova o force: true do server.js:**
   ```javascript
   // Em src/server.js, mude de:
   await sequelize.sync({ force: true });
   // Para:
   await sequelize.sync();
   ```

3. **Inicie o servidor:**
   ```bash
   npm start
   ```

### Opção 2: Recriar Banco (Apenas para Desenvolvimento)

Se você não tem dados importantes no banco, pode usar a opção mais simples:

1. **O server.js já está configurado com `force: true`**
2. **Inicie o servidor:**
   ```bash
   npm start
   ```

⚠️ **ATENÇÃO:** A Opção 2 irá **APAGAR TODOS OS DADOS** do banco de dados!

## O que a Migração Faz

A migração renomeia as seguintes colunas:

### Tabela `users`
- `name` → `nome`
- `passwordHash` → `senha`
- `role` → `perfil`
- `isActive` → `ativo`
- Adiciona: `dataCadastro`

### Tabela `departments`
- `name` → `nome`
- `description` → `descricao`

### Tabela `suppliers`
- `name` → `nome`
- `contactEmail` → `email`
- `phone` → `telefone`
- Adiciona: `contato`
- Remove: `document`

### Tabela `items`
- `name` → `nome`
- `departmentId` → `departamentoId`
- `supplierId` → `fornecedorId`
- `unitPrice` → `valorUnitario`
- `validUntil` → `validade`
- `restriction` → `restricoes`
- `itemType` → `tipoItem`
- `quantityOnHand` → `quantidadeAtual`
- Adiciona: `dataCadastro`, `ativo`

### Tabela `transactions`
- `quantity` → `quantidade`
- `action` → `tipo`
- `when` → `data`
- `note` → `observacoes`
- Adiciona: `itemNome`, `responsavel`, `valorUnitario`, `valorTotal`

## Verificação

Após executar a migração, verifique se:

1. O servidor inicia sem erros
2. As APIs retornam dados com os novos nomes de campos
3. Os relacionamentos funcionam corretamente

## Rollback (Se Necessário)

Se precisar reverter as mudanças, execute o script de rollback:

```sql
-- Script de rollback (execute manualmente no banco)
-- ... (seria necessário criar um script de rollback se necessário)
```

## Próximos Passos

Após a migração bem-sucedida:

1. Teste todas as funcionalidades da API
2. Atualize a documentação da API
3. Notifique a equipe do frontend sobre as mudanças
4. Considere implementar um sistema de migração mais robusto para futuras mudanças
