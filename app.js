let pessoas = [];
let pessoasFiltradas = [];
let indexAtual = 0;

// Elementos DOM
const cardContainer = document.getElementById('cardContainer');
const searchInput = document.getElementById('searchInput');
const genderFilter = document.getElementById('genderFilter');
const areaFilter = document.getElementById('areaFilter');
const btnPrev = document.getElementById('btnPrev');
const btnNext = document.getElementById('btnNext');
const counter = document.getElementById('counter');
const themeToggle = document.getElementById('themeToggle');

// Modal Elements
const gridModal = document.getElementById('gridModal');
const btnGridModal = document.getElementById('btnGridModal');
const btnCloseModal = document.getElementById('btnCloseModal');
const gridContainer = document.getElementById('gridContainer');

// Embaralhar Array (Fisher-Yates)
function embaralhar(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Carregar JSON
async function carregarDados() {
  try {
    const resposta = await fetch('./data/pessoas.json');
    pessoas = await resposta.json();
    pessoas = embaralhar(pessoas); // Ordem inicial aleatória
    aplicarFiltros();
  } catch (erro) {
    cardContainer.innerHTML = `<div class="clay-card"><p>Erro ao carregar acervo histórico.</p></div>`;
  }
}

// Renderizar o Card Ativo
function renderizarCard() {
  if (pessoasFiltradas.length === 0) {
    cardContainer.innerHTML = `
      <div class="clay-card" style="text-align:center;">
        <h3>Nenhum personagem encontrado com os filtros atuais.</h3>
      </div>`;
    counter.textContent = `0 / 0`;
    return;
  }

  const p = pessoasFiltradas[indexAtual];

  cardContainer.innerHTML = `
    <article class="clay-card profile-card">
      <div class="profile-img-box">
        <img src="${p.fotografia}" alt="${p.nomePopular}" class="profile-img" onerror="this.src='https://via.placeholder.com/240x300?text=Sem+Foto'" />
        <span class="badge">${p.areaAtuacao}</span>
      </div>
      
      <div class="info-section">
        <h2>${p.nomePopular}</h2>
        <h4>${p.nomeCompleto}</h4>

        <div class="meta-grid">
          <div><strong>Nascimento:</strong> ${p.nascimento}</div>
          <div><strong>Falecimento:</strong> ${p.falecimento || 'Presente'} (${p.idade} anos)</div>
          <div><strong>Local:</strong> ${p.cidade} - ${p.estado}, ${p.pais}</div>
          <div><strong>Período BR:</strong> ${p.periodoHistoricoBR}</div>
          <div><strong>Período Mundial:</strong> ${p.periodoHistoricoMundial}</div>
          <div><strong>Movimento:</strong> ${p.movimentoArtistico}</div>
        </div>

        <h3>Principais Obras / Feitos</h3>
        <ul class="feats-list">
          ${p.principaisObrasOuFeitos.map(feito => `<li>${feito}</li>`).join('')}
        </ul>

        ${p.curiosidades ? `<p style="margin-bottom:8px;"><strong>Curiosidades:</strong> ${p.curiosidades}</p>` : ''}
        ${p.citacaoFamosa && p.citacaoFamosa !== "N/A" ? `<p style="margin-bottom:12px;"><em>"${p.citacaoFamosa}"</em></p>` : ''}

        <div class="sources-box">
          <strong>Fontes:</strong> ${p.fontes.join(', ')}
        </div>
      </div>
    </article>
  `;

  counter.textContent = `${indexAtual + 1} / ${pessoasFiltradas.length}`;
}

// Renderizar Grade do Modal
function renderizarGrade() {
  gridContainer.innerHTML = '';
  pessoasFiltradas.forEach((p, idx) => {
    const item = document.createElement('div');
    item.className = 'grid-item';
    item.innerHTML = `
      <img src="${p.fotografia}" alt="${p.nomePopular}" onerror="this.src='https://via.placeholder.com/140x140?text=Sem+Foto'" />
      <p>${p.nomePopular}</p>
    `;
    item.addEventListener('click', () => {
      indexAtual = idx;
      renderizarCard();
      gridModal.classList.add('hidden');
    });
    gridContainer.appendChild(item);
  });
}

// Filtros Instantâneos
function aplicarFiltros() {
  const busca = searchInput.value.toLowerCase();
  const genero = genderFilter.value;
  const area = areaFilter.value;

  pessoasFiltradas = pessoas.filter(p => {
    const combinaNome = p.nomeCompleto.toLowerCase().includes(busca) || 
                        p.nomePopular.toLowerCase().includes(busca) ||
                        p.apelidos.some(a => a.toLowerCase().includes(busca));
    const combinaGenero = genero === "" || p.genero === genero;
    const combinaArea = area === "" || p.areaAtuacao === area;

    return combinaNome && combinaGenero && combinaArea;
  });

  indexAtual = 0;
  renderizarCard();
}

// Eventos
btnNext.addEventListener('click', () => {
  if (indexAtual < pessoasFiltradas.length - 1) {
    indexAtual++;
    renderizarCard();
  }
});

btnPrev.addEventListener('click', () => {
  if (indexAtual > 0) {
    indexAtual--;
    renderizarCard();
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') btnNext.click();
  if (e.key === 'ArrowLeft') btnPrev.click();
});

searchInput.addEventListener('input', aplicarFiltros);
genderFilter.addEventListener('change', aplicarFiltros);
areaFilter.addEventListener('change', aplicarFiltros);

// Modal
btnGridModal.addEventListener('click', () => {
  renderizarGrade();
  gridModal.classList.remove('hidden');
});

btnCloseModal.addEventListener('click', () => {
  gridModal.classList.add('hidden');
});

gridModal.addEventListener('click', (e) => {
  if (e.target === gridModal) gridModal.classList.add('hidden');
});

// Alternar Tema
themeToggle.addEventListener('click', () => {
  const body = document.body;
  const temaAtual = body.getAttribute('data-theme');
  body.setAttribute('data-theme', temaAtual === 'light' ? 'dark' : 'light');
});

carregarDados();