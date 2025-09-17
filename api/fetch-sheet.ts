// api/fetch-sheet.ts

export const config = {
  runtime: 'edge',
};

// Acessa a variável de ambiente do Vercel
const SHEET_URL = process.env.VITE_SHEET_URL;

export default async function handler(request: Request) {
  if (!SHEET_URL) {
    return new Response('A variável de ambiente VITE_SHEET_URL não foi configurada no Vercel.', {
      status: 500,
    });
  }

  try {
    // Adiciona um timestamp para evitar o cache da Vercel
    const url = new URL(SHEET_URL);
    url.searchParams.set('_cacheBust', new Date().getTime().toString());

    const response = await fetch(url.toString(), {
        next: {
            revalidate: 300 // Mantém um cache de 5 minutos
        }
    });

    if (!response.ok) {
      throw new Error(`Erro ao buscar a planilha: ${response.statusText}`);
    }

    const csvText = await response.text();

    return new Response(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate'
      },
    });
  } catch (error) {
    console.error('Falha ao buscar dados da planilha:', error);
    return new Response(`Erro ao processar a requisição: ${error.message}`, {
      status: 500,
    });
  }
}
