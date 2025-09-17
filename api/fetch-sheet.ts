// api/fetch-sheet.ts

export const config = {
  runtime: 'edge',
};

const SHEET_URL = process.env.VITE_SHEET_URL;

export default async function handler(request: Request) {
  if (!SHEET_URL) {
    return new Response('A URL da planilha não está configurada.', {
      status: 500,
    });
  }

  try {
    const response = await fetch(SHEET_URL, {
        next: {
            revalidate: 300 // Adiciona cache de 5 minutos
        }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
    console.error('Failed to fetch sheet data:', error);
    return new Response('Error fetching sheet data.', {
      status: 500,
    });
  }
}