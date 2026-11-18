# Frango Brilhante — link-in-bio

Site estático (HTML e CSS puros, sem build) de **https://frangobrilhante.com.br**, servido por nginx em container Docker no Easypanel.

## Arquivos

Tudo fica em `frango-brilhante-linkinbio-site/`:

| Arquivo | Função |
|---|---|
| `index.html` | Página principal (CSS e JS embutidos) |
| `privacidade.html` | Política de Privacidade |
| `404.html` | Página de erro para endereços inexistentes |
| `metaPixel.js` | Helper do Meta Pixel: dispara `Lead` e `FindLocation` nos elementos com `data-fb-event` |
| `robots.txt`, `sitemap.xml` | Indexação |
| `*.webp`, `*.jpg`, `*.png`, `*.ico` | Imagens, favicons e imagem de compartilhamento (`og.jpg`) |
| `inter-latin.woff2`, `inter-OFL.txt` | Fonte Inter hospedada no site e sua licença |
| `Dockerfile`, `nginx.conf` | Imagem de produção e configuração do servidor |

## Rodar localmente

```bash
cd frango-brilhante-linkinbio-site
python -m http.server 8765    # ou: npx serve .
```

Abra http://localhost:8765. O servidor local não reproduz o `nginx.conf` (cabeçalhos, cache e página 404).

## Publicar

1. Commit e push na branch `main` do GitHub.
2. No Easypanel, abra o serviço do site e clique em **Deploy**. O push sozinho não publica.
3. Confira a versão publicada (abaixo).

Para voltar a uma versão anterior: `git revert <commit>`, push e Deploy de novo.

## Conferir depois de publicar

```bash
curl -sI https://frangobrilhante.com.br/                # 200 + cabeçalhos de segurança
curl -s -o /dev/null -w "%{http_code}\n" https://frangobrilhante.com.br/nao-existe   # 404
```

E abra a página no celular para ver se o mapa e os links carregam.

## Manutenção

- **Link do grupo de WhatsApp**: aparece em vários `href` do `index.html`. Troque todas as ocorrências de `chat.whatsapp.com/...`.
- **Imagens novas**: use `.webp`, mantenha `width`/`height` no `<img>` e use `loading="lazy"` só fora da primeira tela.
- **Trocar uma foto da galeria ou de setor**: cada foto tem duas versões, usadas pelo `srcset` (o navegador escolhe conforme a tela). Substitua as duas com o mesmo nome:
  - galeria: `gal-N.webp` (480×600) e `gal-N-336w.webp` (336×420);
  - setores: `set-nome.webp` (480×480) e `set-nome-360w.webp` (360×360);
  - banner: `banner.webp` (1080×720) e `banner-720w.webp` (720×480).
- **Serviço externo novo** (vídeo, pixel, formulário, widget): além da Política de Privacidade, libere o domínio no cabeçalho `Content-Security-Policy` do `nginx.conf`, senão o navegador bloqueia.
- **Mapa**: o iframe usa `data-src` e só carrega quando chega perto da tela. Para trocar o endereço, altere a URL no `data-src` e no `<noscript>`.
- **Arquivo de tipo novo** (ex.: `.svg`, `.pdf`): inclua a extensão no `COPY` do `Dockerfile`, senão ele não vai para produção.
- **Página nova**: adicione ao `sitemap.xml`. Ao alterar uma página, atualize o `<lastmod>` dela.
- **Política de Privacidade**: atualize se o site passar a usar formulários, analytics, pixel ou outro serviço externo.
- **Meta Pixel** (ID `1142556078689079`): o código base fica no `<head>` de `index.html` e `privacidade.html`. Para medir um link ou botão novo, adicione `data-fb-event="Lead"` (contato, WhatsApp, redes sociais) ou `data-fb-event="FindLocation"` (mapa, endereço, rotas) e `data-fb-name="Nome do botão"`. O `metaPixel.js` cuida do resto. Confira os eventos com a extensão Meta Pixel Helper ou no Gerenciador de Eventos (Testar eventos).

## Responsáveis

- Domínio: DNS na Hostinger.
- Hospedagem: Easypanel (VPS).
- Empresa: Supermercado e Frigorifico Frango Brilhante LTDA — CNPJ 48.794.875/0001-39.
