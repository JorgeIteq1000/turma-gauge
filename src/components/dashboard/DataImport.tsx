// src/components/dashboard/DataImport.tsx

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, RefreshCw } from "lucide-react";
import { StudentData } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { convertCsvToJson } from "@/utils/dataProcessor";

interface DataImportProps {
  onDataLoaded: (data: StudentData[]) => void;
  isLoading: boolean;
}

// MODIFICADO: Aponta para o nosso próprio endpoint
const API_URL = "/api/fetch-sheet";

export function DataImport({ onDataLoaded, isLoading }: DataImportProps) {
  const { toast } = useToast();

  const handleUrlLoad = async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      const data = convertCsvToJson(csvText);
      onDataLoaded(data);
      toast({
        title: "Dados atualizados",
        description: `${data.length} registros importados com sucesso!`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao atualizar",
        description: "Não foi possível buscar os dados da planilha.",
      });
    }
  };

  return (
    <Card className="mb-8 shadow-medium border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5 text-primary" />
            Fonte de Dados (Google Sheets)
          </CardTitle>
          <Button
            onClick={handleUrlLoad}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar Dados
          </Button>
        </div>
      </CardHeader>
    </Card>
  );
}