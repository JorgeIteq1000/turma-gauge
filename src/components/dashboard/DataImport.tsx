import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Link, RefreshCw } from "lucide-react";
import { StudentData } from "@/types/student";
import { useToast } from "@/hooks/use-toast";
import { convertCsvToJson } from "@/utils/dataProcessor";

interface DataImportProps {
  onDataLoaded: (data: StudentData[]) => void;
  isLoading: boolean;
}

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ25AYPgZEudDjhakxxgPNt4IjVlrKWmXzrjgcp7M95YPV23Iib4C7bQ8VAXi_AE49cIfg59Ie9z42X/pub?output=csv";

export function DataImport({ onDataLoaded, isLoading }: DataImportProps) {
  const [url, setUrl] = useState(SHEET_URL);
  const { toast } = useToast();

  const handleUrlLoad = async () => {
    if (!url.trim()) {
      toast({
        variant: "destructive",
        title: "URL obrigatória",
        description: "Por favor, insira uma URL válida",
      });
      return;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      const data = convertCsvToJson(csvText);
      onDataLoaded(data);
      toast({
        title: "Dados carregados da URL",
        description: `${data.length} registros importados`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar da URL",
        description: "Verifique se a URL está correta e acessível",
      });
    }
  };

  const handleRefresh = () => {
    if (url.trim()) {
      handleUrlLoad();
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
            onClick={handleRefresh}
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
      <CardContent>
        <div className="flex gap-2">
          <div className="flex-1 space-y-2">
            <Label htmlFor="url-input">URL do endpoint CSV</Label>
            <Input
              id="url-input"
              type="url"
              placeholder="https://exemplo.com/data.csv"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
