import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardMetrics } from "@/types/student";
import { Users, TrendingUp, FileCheck, Clock, Award } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface KPICardsProps {
  metrics: DashboardMetrics;
}

export function KPICards({ metrics }: KPICardsProps) {
  const kpis = [
    {
      title: "Total de Alunos",
      value: metrics.totalAlunos.toLocaleString(),
      icon: Users,
      gradient: "bg-gradient-primary",
      tooltip: "Número total de alunos cadastrados no sistema"
    },
    {
      title: "% Em Dia",
      value: `${metrics.percentualEmDia.toFixed(1)}%`,
      icon: TrendingUp,
      gradient: "bg-gradient-success",
      tooltip: "Percentual de alunos com pagamentos em dia (100% das cobranças pagas)"
    },
    {
      title: "Progresso Médio",
      value: `${metrics.progressoMedioDisciplinas.toFixed(1)}%`,
      icon: Award,
      gradient: "bg-gradient-warning",
      tooltip: "Média percentual de disciplinas completadas por todos os alunos"
    },
    {
      title: "Docs Completos",
      value: metrics.documentosCompletos.toString(),
      icon: FileCheck,
      gradient: "bg-gradient-primary",
      tooltip: "Número de alunos com documentação completa (status OK)"
    },
    {
      title: "Certificados (30d)",
      value: metrics.solicitacoesCertificados30d.toString(),
      icon: Clock,
      gradient: "bg-gradient-success",
      tooltip: "Número de solicitações de certificados (digitais e impressos) nos últimos 30 dias"
    },
  ];

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Card 
                  className="relative overflow-hidden border-0 shadow-medium hover:shadow-strong transition-shadow duration-300 cursor-help"
                >
                  <div className={`absolute inset-0 ${kpi.gradient} opacity-5`} />
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {kpi.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${kpi.gradient} text-white shadow-medium`}>
                      <Icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-3xl font-bold text-foreground">
                      {kpi.value}
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">{kpi.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}