# Fontes, direitos e limitações

## Procedência dos dados

- [PokéAPI — tabelas CSV](https://github.com/PokeAPI/pokeapi/tree/master/data/v2/csv): espécies, identificadores, aprendizagem por grupo de versões, encontros, catálogos regionais, grupos de ovos e condições evolutivas.
- [Documentação da PokéAPI](https://pokeapi.co/docs/v2): contratos usados pelo adaptador local.
- [pret/pokefirered — atributos e habilidades](https://github.com/pret/pokefirered/blob/master/src/data/pokemon/species_info.h): atributos e habilidades originais de GBA.
- [pret/pokefirered — golpes](https://github.com/pret/pokefirered/blob/master/src/data/battle_moves.h): poder, tipo, precisão e PP históricos dos 354 golpes dos cartuchos GBA. Golpes de Shadow de outros jogos não foram incluídos.
- [pret/pokefirered — constantes de evolução](https://github.com/pret/pokefirered/blob/master/include/constants/pokemon.h): amizade mínima de 220 na Geração III; os valores modernos de 160 foram substituídos.
- [Sprites de FireRed/LeafGreen](https://github.com/PokeAPI/sprites/tree/master/sprites/pokemon/versions/generation-iii/firered-leafgreen): 386 PNGs locais, preservando a fonte visual usada na v3.4.

Os arquivos consultados têm URLs e SHA-256 em `data/source-lock.json`. Os hashes dos recursos distribuídos, inclusive sprites, estão em `asset-manifest.json`. Os downloads foram feitos durante esta conversão; atualizar os extratores pode obter novas revisões das fontes. Confira os hashes antes de substituir a base aprovada.

## Direitos e condições

Projeto de fã não oficial — Pokémon, personagens e marcas pertencem aos respectivos titulares, incluindo Nintendo, Game Freak, Creatures e The Pokémon Company. Nenhuma ROM é incluída.

A licença da PokéAPI está preservada em `licenses/PokeAPI-LICENSE.md`, incluindo atribuição, condições de redistribuição e ausência de garantias. O projeto pret é uma referência técnica de engenharia reversa; seus arquivos de código de jogo não são necessários para executar o PWA distribuído.

O aviso de [PokeAPI/sprites](https://github.com/PokeAPI/sprites/blob/master/LICENCE.txt), copiado integralmente em `licenses/PokeAPI-sprites-LICENCE.txt`, declara CC0 para o repositório e ressalva os direitos das imagens da The Pokémon Company. Isso não deve ser interpretado como uma licença comercial dos personagens ou marcas. Preserve os avisos de titularidade ao redistribuir o aplicativo.

As traduções em português são informativas e não oficiais. Os nomes originais em inglês continuam visíveis. A assinatura by FlashCore foi preservada; os ícones PN representam a moldura do aplicativo. As ilustrações esquemáticas foram removidas no Guia da Jornada 2.0.

O conteúdo de exploração em português foi produzido para o aplicativo e conferido nas partes 1 a 20 do [guia FireRed/LeafGreen da Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Walkthrough:Pok%C3%A9mon_FireRed_and_LeafGreen). Cada etapa oferece a referência correspondente. Os encontros usam a base local, filtrada especificamente para FireRed.

## Limites de conteúdo mantidos

- FireRed e LeafGreen têm as 43 etapas originais; guias de Hoenn não foram ampliados.
- Encontros são os registrados pela fonte para cada versão; não constituem uma lista exaustiva de presentes, trocas, eventos, requisitos de acesso e distribuição histórica. A ausência de encontro não significa impossibilidade de obtenção. O aviso da ficha foi mantido.
- O aplicativo é um guia; não lê nem modifica saves do jogo. Capturas no PC são registros manuais.
- Os sprites são frontais, estáticos e representativos da espécie, como na base. Não há seleção de formas, sexo ou shiny. Deoxys usa atributos próprios do jogo selecionado; o sprite permanece na coleção FR/LG original.
- Alguns termos de categoria da espécie e localizações especiais permanecem em inglês. Todos os 354 golpes têm rótulo em português e nome original; as traduções herdadas da v3.4 prevalecem.
- O ranking de batalha estima tipos, poder e STAB; não calcula dano completo nem considera habilidades, IV/EV, velocidade ou nível. A categoria física/especial continua determinada pelo tipo na Geração III.
- Golpes de poder variável usam os valores/sentinelas da tabela do jogo; não há simulação de todos os efeitos especiais.
- Somente as missões obrigatórias possuem checklist, conforme a v3.4; atividades opcionais são texto de orientação.
- Os links de mapas e referências externas exigem internet. Checklists, encontros, orientações e demais telas essenciais funcionam offline.
- A exploração 2.0 é uma referência de FireRed; LeafGreen preserva missões e progresso próprios com aviso de diferenças entre versões.
- Itens e orientações priorizam informações verificadas úteis à história; não são um inventário completo de cada item escondido ou um mapa de cada passo das cavernas. Informações não incorporadas são sinalizadas.

## Armazenamento e iOS

O cache só é declarado completo após conferir todos os arquivos. A primeira preparação e o download de atualizações exigem conexão. Excluir dados do site, remover perfis ou algumas opções de desinstalação pode apagar dados locais; guarde backups JSON fora do navegador.

O PWA solicita armazenamento persistente quando o navegador oferece essa API. A concessão é decisão do navegador. O WebKit documenta possibilidade de remoção de dados sob pressão de armazenamento, quotas ou falta prolongada de uso; uma instalação não substitui backup. [Política oficial do WebKit](https://webkit.org/blog/14403/updates-to-storage-policy/).

No iPhone, retorne ao app conectado para permitir consultas de atualização e mantenha a tela aberta durante a preparação. A distribuição precisa de HTTPS; `localhost` só é exceção para desenvolvimento no próprio dispositivo. [Service Workers — MDN](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

Instalação efetiva em iPhone/Android, comportamento do armazenamento entre Safari e tela inicial e funcionamento com pouca memória precisam ser validados nos aparelhos reais. Endereço publicado: [PokéNav GBA](https://flashcore-nexus.github.io/pokenav-gba/).
