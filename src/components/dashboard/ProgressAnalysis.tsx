import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessedStudent } from "@/types/student";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ProgressAnalysisProps {
  students: ProcessedStudent[];
}

export function ProgressAnalysis({ students }: ProgressAnalysisProps) {
  const scatterData = students.map((student, index) => ({
    x: student.disciplinasPercentual,
    y: student.cobrancasPercentual,
    nome: student.nome,
    curso: student.curso,
    risco: getRiskLevel(student.disciplinasPercentual, student.cobrancasPercentual),
    index,
  }));

  function getRiskLevel(disciplinas: number, cobrancas: number): "baixo" | "medio" | "alto" {
    if (disciplinas >= 80 && cobrancas >= 80) return "baixo";
    if (disciplinas >= 50 && cobrancas >= 50) return "medio";
    return "alto";
  }

  const riskColors = {
    baixo: "hsl(var(--success))",
    medio: "hsl(var(--warning))", 
    alto: "hsl(var(--destructive))",
  };

  // Group students by course for analysis
  const courseAnalysis = students.reduce((acc, student) => {
    const curso = student.curso;
    if (!acc[curso]) {
      acc[curso] = {
        total: 0,
        disciplinasMedia: 0,
        cobrancasMedia: 0,
        emDia: 0,
      };
    }
    
    acc[curso].total += 1;
    acc[curso].disciplinasMedia += student.disciplinasPercentual;
    acc[curso].cobrancasMedia += student.cobrancasPercentual;
    if (student.inadimplenciaCategoria === "Em dia") {
      acc[curso].emDia += 1;
    }
    
    return acc;
  }, {} as Record<string, any>);

  // Calculate averages
  Object.keys(courseAnalysis).forEach(curso => {
    const data = courseAnalysis[curso];
    data.disciplinasMedia = data.disciplinasMedia / data.total;
    data.cobrancasMedia = data.cobrancasMedia / data.total;
    data.percentualEmDia = (data.emDia / data.total) * 100;
  });

  const courseData = Object.entries(courseAnalysis).map(([curso, data]) => ({
    curso: curso.length > 30 ? curso.substring(0, 30) + "..." : curso,
    cursoCompleto: curso,
    ...data,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Risk Scatter Plot */}
      <Card className="shadow-medium border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Análise de Risco: Disciplinas vs Cobranças
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Disciplinas %" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Cobranças %" 
                domain={[0, 100]}
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: any, name: string) => [
                  `${Number(value).toFixed(1)}%`,
                  name === "x" ? "Disciplinas" : "Cobranças"
                ]}
                labelFormatter={() => ""}
                content={({ active, payload }) => {
                  if (active && payload && payload[0]) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 border rounded-lg shadow-md">
                        <p className="font-medium">{data.nome}</p>
                        <p className="text-sm text-muted-foreground">{data.curso}</p>
                        <p className="text-sm">Disciplinas: {data.x.toFixed(1)}%</p>
                        <p className="text-sm">Cobranças: {data.y.toFixed(1)}%</p>
                        <p className="text-sm capitalize">Risco: {data.risco}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Alunos" data={scatterData} fill="hsl(var(--primary))">
                {scatterData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={riskColors[entry.risco]}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
          
          {/* Legend */}
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>Baixo Risco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>Médio Risco</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive"></div>
              <span>Alto Risco</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course Analysis */}
      <Card className="shadow-medium border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Análise por Curso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[350px] overflow-y-auto">
            {courseData
              .sort((a, b) => b.total - a.total)
              .map((curso, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 border">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm" title={curso.cursoCompleto}>
                    {curso.curso}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {curso.total} alunos
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex justify-between">
                      <span>Disciplinas:</span>
                      <span className="font-medium">
                        {curso.disciplinasMedia.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gradient-primary h-1.5 rounded-full"
                        style={{ width: `${curso.disciplinasMedia}%` }}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between">
                      <span>Em dia:</span>
                      <span className="font-medium">
                        {curso.percentualEmDia.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-1.5 mt-1">
                      <div
                        className="bg-gradient-success h-1.5 rounded-full"
                        style={{ width: `${curso.percentualEmDia}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}