// src/components/dashboard/DataImport.tsx

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, RefreshCw } from "lucide-react";
import { StudentData } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { convertCsvToJson } from "@/utils/dataProcessor";

interface DataImportProps {
  onDataLoaded: (data: StudentData[]) => void;
  isLoading: boolean;
  onLoadingChange: (loading: boolean) => void;
}

// URL pública da sua planilha do Google Sheets
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ25AYPgZEudDjhakxxgPNt4IjVlrKWmXzrjgcp7M95YPV23Iib4C7bQ8VAXi_AE49cIfg59Ie9z42X/pub?output=csv";

export function DataImport({ onDataLoaded, isLoading, onLoadingChange }: DataImportProps) {
  const { toast } = useToast();

  const handleDataFetch = async () => {
    onLoadingChange(true);
    try {
      // Adicionamos um timestamp para evitar o cache do navegador
      const response = await fetch(`${SHEET_URL}&_=${new Date().getTime()}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar a planilha. Status: ${response.status}`);
      }
      const csvText = await response.text();
      const data = convertCsvToJson(csvText);
      onDataLoaded(data);
      toast({
        title: "Dados atualizados",
        description: `${data.length} registros importados com sucesso!`,
      });
    } catch (error) {
      console.error("Erro ao carregar dados do Google Sheets:", error);
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível buscar os dados. Verifique se a planilha está pública e o link está correto.",
      });
    } finally {
      onLoadingChange(false);
    }
  };

  // Carrega os dados na primeira vez que o componente é montado
  useEffect(() => {
    handleDataFetch();
  }, []);

  return (
    <Card className="mb-8 shadow-medium border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Fonte de Dados (Google Sheets)
          </CardTitle>
          <Button
            onClick={handleDataFetch}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Atualizando..." : "Atualizar Dados"}
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}
