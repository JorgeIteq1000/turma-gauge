import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Link, RefreshCw } from "lucide-react";
import { StudentData } from "@/types/student";
import { useToast } from "@/hooks/use-toast";

interface DataImportProps {
  onDataLoaded: (data: StudentData[]) => void;
  isLoading: boolean;
}

export function DataImport({ onDataLoaded, isLoading }: DataImportProps) {
  const [url, setUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text) as StudentData[];
      onDataLoaded(data);
      toast({
        title: "Arquivo carregado com sucesso",
        description: `${data.length} registros importados`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao carregar arquivo",
        description: "Verifique se o arquivo é um JSON válido",
      });
    }
  };

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
      const data = await response.json() as StudentData[];
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
    } else if (fileInputRef.current?.files?.[0]) {
      handleFileUpload({ target: fileInputRef.current } as any);
    }
  };

  return (
    <Card className="mb-8 shadow-medium border-0">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Importar Dados
          </CardTitle>
          <Button
            onClick={handleRefresh}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">Arquivo Local</TabsTrigger>
            <TabsTrigger value="url">URL/Endpoint</TabsTrigger>
          </TabsList>
          
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file-upload">Selecionar arquivo JSON</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                ref={fileInputRef}
                disabled={isLoading}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="url" className="space-y-4">
            <div className="flex gap-2">
              <div className="flex-1 space-y-2">
                <Label htmlFor="url-input">URL do endpoint JSON</Label>
                <Input
                  id="url-input"
                  type="url"
                  placeholder="https://exemplo.com/data.json"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={handleUrlLoad}
                  disabled={isLoading || !url.trim()}
                  className="gap-2 bg-gradient-primary hover:opacity-90"
                >
                  <Link className="h-4 w-4" />
                  Carregar
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}