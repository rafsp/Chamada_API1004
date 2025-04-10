// Seleciona os elementos HTML essenciais
const cityInput = document.getElementById('cityInput');
const weatherButton = document.getElementById('weatherBtn'); // ID do botão atualizado no HTML
const weatherDisplayDiv = document.getElementById('weatherDisplay');

// Verifica se os elementos foram encontrados
if (!cityInput || !weatherButton || !weatherDisplayDiv) {
    console.error("ERRO: Elemento(s) 'cityInput', 'weatherBtn' ou 'weatherDisplay' não encontrado(s). Verifique os IDs no HTML.");
} else {
    console.log("Elementos HTML encontrados.");
    // O evento é chamado via onclick no HTML ('fetchWeather()')
}

/**
 * Função assíncrona para buscar a previsão do tempo para uma cidade usando a API Goweather.
 * Chamada diretamente pelo atributo onclick no HTML.
 */
async function fetchWeather() {
    // Verifica se os elementos essenciais estão disponíveis
    if (!cityInput || !weatherButton || !weatherDisplayDiv) {
        console.error("ERRO: Elementos essenciais não disponíveis na função fetchWeather.");
        return;
    }

    // Obtém o nome da cidade do campo de input, removendo espaços extras
    const cityName = cityInput.value.trim();

    // Validação simples: verifica se o nome da cidade foi inserido
    if (!cityName) {
        weatherDisplayDiv.textContent = 'Por favor, digite o nome de uma cidade.';
        weatherDisplayDiv.classList.add('error');
        weatherDisplayDiv.classList.remove('loading');
        return; // Interrompe a função se não houver nome da cidade
    }

    console.log(`fetchWeather: Iniciando busca para a cidade: ${cityName}`);

    // Desativa o botão e atualiza a interface para "carregando"
    weatherButton.disabled = true;
    weatherDisplayDiv.innerHTML = 'A buscar previsão...'; // Limpa conteúdo anterior
    weatherDisplayDiv.classList.add('loading');
    weatherDisplayDiv.classList.remove('error');

    // Constrói a URL da API Goweather dinamicamente com o nome da cidade
    // encodeURIComponent trata espaços e caracteres especiais no nome da cidade
    const apiUrl = `https://goweather.herokuapp.com/weather/${encodeURIComponent(cityName)}`;

    alert(apiUrl);


    try {
        console.log("fetchWeather: Enviando requisição para", apiUrl);
        const response = await fetch(apiUrl); // Não precisamos de 'options' aqui
        console.log("fetchWeather: Resposta recebida, status:", response.status);

        // Verifica se a resposta foi bem-sucedida
        // A API Goweather pode retornar 200 OK mesmo para cidade não encontrada,
        // então a verificação do conteúdo é mais importante.
        if (!response.ok) {
            // Tratamento genérico para erros HTTP inesperados
            throw new Error(`Falha na requisição HTTP (Status: ${response.status})`);
        }

        // Converte a resposta para JSON
        const data = await response.json();
        console.log("fetchWeather: Dados JSON recebidos:", data);

        // Verifica se a API retornou dados válidos (ex: temperatura)
        // Se a cidade não for encontrada, a API pode retornar um objeto vazio ou com campos vazios.
        if (data && data.temperature) {
            // Formata e exibe os dados do tempo
            weatherDisplayDiv.innerHTML = `
                <p><strong>Cidade:</strong> ${cityName}</p>
                <p><strong>Temperatura:</strong> ${data.temperature}</p>
                <p><strong>Vento:</strong> ${data.wind}</p>
                <p><strong>Descrição:</strong> ${data.description}</p>
            `;
            weatherDisplayDiv.classList.remove('loading', 'error');
            console.log("fetchWeather: Previsão exibida com sucesso.");
        } else {
            // Se a API não retornou dados válidos (provavelmente cidade não encontrada)
            console.warn("fetchWeather: Cidade não encontrada ou dados inválidos recebidos.", data);
            throw new Error(`Não foi possível encontrar a previsão para "${cityName}". Verifique o nome da cidade.`);
        }

    } catch (error) {
        // Captura erros (de rede, HTTP, ou dados inválidos)
        console.error("fetchWeather: Erro capturado:", error);

        // Exibe mensagem de erro
        weatherDisplayDiv.innerHTML = `Erro: ${error.message}`;
        weatherDisplayDiv.classList.add('error');
        weatherDisplayDiv.classList.remove('loading');

    } finally {
        // Reativa o botão
        if (weatherButton) {
            weatherButton.disabled = false;
            console.log("fetchWeather: Botão reativado (finally).");
        }
    }
}
