# Deploy do Forbidden (Frontend Admin)

## Configuração

1. **Atualize a URL da API** em `.env.production`:
   ```
   REACT_APP_API_BASE_URL=https://seudominio.com/dreadhunters/api/
   ```
   Troque `seudominio.com` pelo seu domínio real.

## Build

Execute o build de produção:

```bash
npm run build
```

Isso vai gerar a pasta `build/` com os arquivos estáticos otimizados.

## Deploy

### Opção 1: Upload via FTP/SFTP

1. Acesse seu servidor via FTP (FileZilla, WinSCP, etc)
2. Navegue até `public_html/`
3. Crie uma pasta chamada `forbidden` (se não existir)
4. Faça upload de **todo o conteúdo** da pasta `build/` para `public_html/forbidden/`
   - Ou seja: `build/index.html` → `public_html/forbidden/index.html`
   - E todos os outros arquivos (pasta static, manifest, etc)

### Opção 2: Upload via cPanel

1. Acesse o cPanel
2. Vá em "Gerenciador de Arquivos"
3. Navegue até `public_html/`
4. Crie a pasta `forbidden`
5. Faça upload dos arquivos de `build/` para dentro de `forbidden/`

## Configuração do .htaccess

Crie ou edite o arquivo `public_html/forbidden/.htaccess` com o seguinte conteúdo:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /forbidden/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /forbidden/index.html [L]
</IfModule>
```

Isso garante que o React Router funcione corretamente com URLs diretas.

## Acesso

Após o deploy, o painel admin estará disponível em:
- `https://seudominio.com/forbidden`

## Verificação

1. Acesse `https://seudominio.com/forbidden`
2. Faça login com suas credenciais
3. Verifique se a API está respondendo corretamente
4. Teste as páginas de CRUD (Classes, Skills, etc)

## Troubleshooting

### Página em branco
- Verifique se o `homepage` no `package.json` está correto: `"/forbidden"`
- Certifique-se que fez o build **depois** de configurar o homepage

### Erro 404 ao navegar entre páginas
- Verifique se o `.htaccess` está na pasta `forbidden/`
- Certifique-se que o mod_rewrite está habilitado no servidor

### Erro de CORS ou API não responde
- Verifique se a URL da API em `.env.production` está correta
- Certifique-se que o backend está rodando
- Verifique as configurações de CORS no backend

### Assets (CSS/JS) não carregam
- Limpe o cache do navegador
- Verifique se todos os arquivos da pasta `build/static/` foram enviados
- Confirme que as permissões dos arquivos estão corretas (644 para arquivos, 755 para pastas)
