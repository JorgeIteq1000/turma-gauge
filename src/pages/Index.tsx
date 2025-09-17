import { useState, useEffect } from "react";
import { StudentData, ProcessedStudent, DashboardMetrics } from "@/types/student";
import { processStudentData, calculateMetrics, convertCsvToJson } from "@/utils/dataProcessor";
import { DataImport } from "@/components/dashboard/DataImport";
import { KPICards } from "@/components/dashboard/KPICards";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { CertificateTimeline } from "@/components/dashboard/CertificateTimeline";
import { ProgressAnalysis } from "@/components/dashboard/ProgressAnalysis";
import { StudentTable } from "@/components/dashboard/StudentTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Database } from "lucide-react";

// MODIFICADO: Aponta para nosso próprio endpoint
const API_URL = "/api/fetch-sheet";

const Index = () => {
  const [rawData, setRawData] = useState<StudentData[]>([]);
  const [processedStudents, setProcessedStudents] = useState<ProcessedStudent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Começa carregando
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const loadDataFromApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const csvText = await response.text();
      const data = convertCsvToJson(csvText);
      handleDataLoaded(data);
    } catch (error) {
      console.error("Erro ao carregar dados da API:", error);
      setIsLoading(false);
    }
  };
  
  // Carrega os dados na primeira vez que o componente é montado
  useEffect(() => {
    loadDataFromApi();
  }, []);


  // Auto-refresh every 15 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (rawData.length > 0) {
        refreshData();
      }
    }, 15 * 60 * 1000); // 15 minutes

    return () => clearInterval(interval);
  }, [rawData]);

  const refreshData = () => {
    if (rawData.length > 0) {
        loadDataFromApi();
    }
  };

  const handleDataLoaded = (data: StudentData[]) => {
    setIsLoading(true);
    setRawData(data);
    
    setTimeout(() => {
      const processed = processStudentData(data);
      const calculatedMetrics = calculateMetrics(processed);
      
      setProcessedStudents(processed);
      setMetrics(calculatedMetrics);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
  };

  if (!metrics && isLoading) {
    return (
       <div className="min-h-screen bg-background p-4 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-primary text-white shadow-medium">
                <Database className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Acadêmico
              </h1>
            </div>
            <p className="text-muted-foreground">
              Sistema de análise e acompanhamento de estudantes
            </p>
          </header>
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h2 className="text-xl font-semibold text-foreground">
                  Carregando dados da planilha...
                </h2>
                <p className="text-muted-foreground">
                  Buscando informações atualizadas.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-background p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-gradient-primary text-white shadow-medium">
                <Database className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">
                Dashboard Acadêmico
              </h1>
            </div>
            {metrics && (
            <p className="text-muted-foreground">
              Análise e acompanhamento de {metrics.totalAlunos} estudantes
            </p>
            )}
          </div>
          
          {lastUpdate && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Última atualização:</span>
              <Badge variant="outline" className="font-mono">
                {lastUpdate.toLocaleString('pt-BR')}
              </Badge>
            </div>
          )}
        </header>

        <DataImport onDataLoaded={handleDataLoaded} isLoading={isLoading} />

        {isLoading ? (
          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h2 className="text-xl font-semibold text-foreground">
                  Processando dados...
                </h2>
                <p className="text-muted-foreground">
                  Analisando informações dos estudantes
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {metrics && (
              <>
                <KPICards metrics={metrics} />
                <StatusChart students={processedStudents} />
                <CertificateTimeline students={processedStudents} />
                <ProgressAnalysis students={processedStudents} />
                <StudentTable students={processedStudents} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Index;