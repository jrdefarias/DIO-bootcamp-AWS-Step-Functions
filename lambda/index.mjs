export const handler = async (event) => {
    // Se não passarmos nenhum ID no teste, ele assume o ID 1 (Luke) por padrão
    const characterId = event.character_id || 1;
    //URL da Api
    const url = `https://swapi.info/api/people/${characterId}`;

    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro na API Star Wars: Status ${response.status}`);
        }

        const data = await response.json();

        // Retornamos um objeto simples com o nome e a quantidade de filmes
        return {
            id: characterId,
            name: data.name,
            films_count: data.films.length
        };
        
    } catch (error) {
        // O Step Functions vai capturar esse erro se algo falhar (ex: ID que não existe)
        throw new Error(`Falha ao buscar personagem: ${error.message}`);
    }
};