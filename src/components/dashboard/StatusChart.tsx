import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessedStudent } from "@/types/student";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { PieChart, Pie, Legend } from "recharts";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface StatusChartProps {
  students: ProcessedStudent[];
}

export function StatusChart({ students }: StatusChartProps) {
  // Status distribution
  const statusData = students.reduce((acc, student) => {
    const status = student.statusInscricao;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status,
    count,
    percentage: ((count / students.length) * 100).toFixed(1),
  }));

  // Inadimplência distribution
  const inadimplenciaData = students.reduce((acc, student) => {
    const categoria = student.inadimplenciaCategoria;
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const inadimplenciaPieData = Object.entries(inadimplenciaData).map(([categoria, count]) => ({
    name: categoria,
    value: count,
    percentage: ((count / students.length) * 100).toFixed(1),
  }));

  const statusColors = {
    "Cursando": "hsl(var(--primary))",
    "Formado": "hsl(var(--success))",
    "Trancado": "hsl(var(--warning))",
    "Evadido": "hsl(var(--destructive))",
  };

  const inadimplenciaColors = {
    "Em dia": "#7FB77E",
    "Atraso leve": "#F5C96B", 
    "Atraso médio": "#FFA07A",
    "Inadimplente grave": "#E57373",
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Status de Inscrição</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm space-y-1">
                    <p><strong>Cursando:</strong> Aluno ativo no curso</p>
                    <p><strong>Formado:</strong> Curso concluído com sucesso</p>
                    <p><strong>Trancado:</strong> Matrícula temporariamente suspensa</p>
                    <p><strong>Evadido:</strong> Abandono do curso</p>
                  </div>
                </TooltipContent>
              </UITooltip>
            </div>
          </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="status" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => [
                  `${value} alunos`,
                  "Quantidade"
                ]}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {statusChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={statusColors[entry.status as keyof typeof statusColors] || "hsl(var(--primary))"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

        <Card className="shadow-medium border-0">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg font-semibold">Situação Financeira</CardTitle>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-sm space-y-1">
                    <p><strong>Em dia:</strong> 100% das cobranças pagas</p>
                    <p><strong>Atraso leve:</strong> 80-99% das cobranças pagas</p>
                    <p><strong>Atraso médio:</strong> 50-79% das cobranças pagas</p>
                    <p><strong>Inadimplente grave:</strong> Menos de 50% pago</p>
                  </div>
                </TooltipContent>
              </UITooltip>
            </div>
          </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={inadimplenciaPieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
              >
                {inadimplenciaPieData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={inadimplenciaColors[entry.name as keyof typeof inadimplenciaColors]}
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: any) => [`${value} alunos`, "Quantidade"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}