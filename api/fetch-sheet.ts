// api/fetch-sheet.ts

export const config = {
  runtime: 'edge',
};

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ25AYPgZEudDjhakxxgPNt4IjVlrKWmXzrjgcp7M95YPV23Iib4C7bQ8VAXi_AE49cIfg59Ie9z42X/pub?output=csv";

export default async function handler(request: Request) {
  try {
    const response = await fetch(SHEET_URL, {
        next: {
            revalidate: 300 // Adiciona cache de 5 minutos (300 segundos)
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
        'Access-Control-Allow-Origin': '*', // Permite que o seu frontend acesse
      },
    });
  } catch (error) {
    console.error('Failed to fetch sheet data:', error);
    return new Response('Error fetching sheet data.', {
      status: 500,
    });
  }
}