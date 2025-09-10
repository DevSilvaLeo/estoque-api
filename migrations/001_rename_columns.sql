-- Migração para renomear colunas das tabelas para português
-- Execute este script no banco de dados antes de iniciar a aplicação

-- Renomear colunas da tabela users
ALTER TABLE users 
  CHANGE COLUMN name nome VARCHAR(120) NOT NULL,
  CHANGE COLUMN passwordHash senha VARCHAR(120) NOT NULL,
  CHANGE COLUMN role perfil ENUM('ADMIN', 'OPERADOR', 'VISUALIZADOR') NOT NULL DEFAULT 'VISUALIZADOR',
  CHANGE COLUMN isActive ativo BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN dataCadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Renomear colunas da tabela departments
ALTER TABLE departments 
  CHANGE COLUMN name nome VARCHAR(120) NOT NULL UNIQUE,
  CHANGE COLUMN description descricao VARCHAR(255);

-- Renomear colunas da tabela suppliers
ALTER TABLE suppliers 
  CHANGE COLUMN name nome VARCHAR(160) NOT NULL,
  CHANGE COLUMN contactEmail email VARCHAR(160),
  CHANGE COLUMN phone telefone VARCHAR(40),
  ADD COLUMN contato VARCHAR(120),
  DROP COLUMN document;

-- Renomear colunas da tabela items
ALTER TABLE items 
  CHANGE COLUMN name nome VARCHAR(200) NOT NULL,
  CHANGE COLUMN departmentId departamentoId INT UNSIGNED,
  CHANGE COLUMN supplierId fornecedorId INT UNSIGNED,
  CHANGE COLUMN unitPrice valorUnitario DECIMAL(12,2),
  CHANGE COLUMN validUntil validade DATE,
  CHANGE COLUMN restriction restricoes VARCHAR(255),
  CHANGE COLUMN itemType tipoItem ENUM('PRODUTO', 'MATERIAL', 'EQUIPAMENTO', 'FERRAMENTA', 'OUTROS') NOT NULL DEFAULT 'OUTROS',
  CHANGE COLUMN quantityOnHand quantidadeAtual INT NOT NULL DEFAULT 0,
  ADD COLUMN dataCadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN ativo BOOLEAN NOT NULL DEFAULT TRUE;

-- Renomear colunas da tabela transactions
ALTER TABLE transactions 
  CHANGE COLUMN quantity quantidade INT NOT NULL,
  CHANGE COLUMN action tipo ENUM('ENTRADA', 'SAIDA') NOT NULL,
  CHANGE COLUMN when data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CHANGE COLUMN note observacoes VARCHAR(255),
  ADD COLUMN itemNome VARCHAR(200) NOT NULL,
  ADD COLUMN responsavel VARCHAR(120) NOT NULL,
  ADD COLUMN valorUnitario DECIMAL(12,2),
  ADD COLUMN valorTotal DECIMAL(12,2);

-- Atualizar foreign keys para usar os novos nomes
ALTER TABLE items 
  DROP FOREIGN KEY items_departmentId_fkey,
  DROP FOREIGN KEY items_supplierId_fkey,
  ADD CONSTRAINT items_departamentoId_fkey FOREIGN KEY (departamentoId) REFERENCES departments(id),
  ADD CONSTRAINT items_fornecedorId_fkey FOREIGN KEY (fornecedorId) REFERENCES suppliers(id);

-- Atualizar foreign keys da tabela transactions
ALTER TABLE transactions 
  DROP FOREIGN KEY transactions_itemId_fkey,
  DROP FOREIGN KEY transactions_performedByUserId_fkey,
  ADD CONSTRAINT transactions_itemId_fkey FOREIGN KEY (itemId) REFERENCES items(id),
  ADD CONSTRAINT transactions_performedByUserId_fkey FOREIGN KEY (performedByUserId) REFERENCES users(id);
