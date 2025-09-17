import { useState, useEffect } from "react";
import { StudentData, ProcessedStudent, DashboardMetrics } from "@/types/student";
import { processStudentData, calculateMetrics } from "@/utils/dataProcessor";
import { DataImport } from "@/components/dashboard/DataImport";
import { KPICards } from "@/components/dashboard/KPICards";
import { StatusChart } from "@/components/dashboard/StatusChart";
import { CertificateTimeline } from "@/components/dashboard/CertificateTimeline";
import { ProgressAnalysis } from "@/components/dashboard/ProgressAnalysis";
import { StudentTable } from "@/components/dashboard/StudentTable";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Database } from "lucide-react";

const Index = () => {
  const [rawData, setRawData] = useState<StudentData[]>([]);
  const [processedStudents, setProcessedStudents] = useState<ProcessedStudent[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

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
    if (rawData.length === 0) return;
    
    setIsLoading(true);
    // Simulate processing time for better UX
    setTimeout(() => {
      const processed = processStudentData(rawData);
      const calculatedMetrics = calculateMetrics(processed);
      
      setProcessedStudents(processed);
      setMetrics(calculatedMetrics);
      setLastUpdate(new Date());
      setIsLoading(false);
    }, 1000);
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

  if (!metrics) {
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

          <DataImport onDataLoaded={handleDataLoaded} isLoading={isLoading} />

          <Card className="shadow-medium border-0">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="p-4 rounded-full bg-muted/50 w-20 h-20 mx-auto flex items-center justify-center">
                  <Database className="h-10 w-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Carregue seus dados para começar
                </h2>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Importe um arquivo JSON ou conecte-se a um endpoint para visualizar 
                  métricas e análises detalhadas dos seus estudantes.
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
            <p className="text-muted-foreground">
              Análise e acompanhamento de {metrics.totalAlunos} estudantes
            </p>
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
            <KPICards metrics={metrics} />
            <StatusChart students={processedStudents} />
            <CertificateTimeline students={processedStudents} />
            <ProgressAnalysis students={processedStudents} />
            <StudentTable students={processedStudents} />
          </>
        )}
      </div>
    </div>
  );
};

export default Index;