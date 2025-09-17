import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessedStudent } from "@/types/student";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CertificateTimelineProps {
  students: ProcessedStudent[];
}

export function CertificateTimeline({ students }: CertificateTimelineProps) {
  // Generate data for the last 30 days
  const endDate = new Date();
  const startDate = subDays(endDate, 30);
  
  const dateRange = eachDayOfInterval({ start: startDate, end: endDate });
  
  const timelineData = dateRange.map(date => {
    const digitalRequests = students.filter(student => 
      student.dataSolicDigital && 
      format(student.dataSolicDigital, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length;
    
    const printRequests = students.filter(student => 
      student.dataSolicImpresso && 
      format(student.dataSolicImpresso, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    ).length;
    
    return {
      date: format(date, 'dd/MM'),
      digital: digitalRequests,
      impresso: printRequests,
      total: digitalRequests + printRequests,
    };
  });

  // Calculate totals for different periods
  const last7Days = students.filter(s => {
    const sevenDaysAgo = subDays(new Date(), 7);
    return (s.dataSolicDigital && s.dataSolicDigital >= sevenDaysAgo) ||
           (s.dataSolicImpresso && s.dataSolicImpresso >= sevenDaysAgo);
  }).length;

  const last30Days = students.filter(s => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return (s.dataSolicDigital && s.dataSolicDigital >= thirtyDaysAgo) ||
           (s.dataSolicImpresso && s.dataSolicImpresso >= thirtyDaysAgo);
  }).length;

  const last90Days = students.filter(s => {
    const ninetyDaysAgo = subDays(new Date(), 90);
    return (s.dataSolicDigital && s.dataSolicDigital >= ninetyDaysAgo) ||
           (s.dataSolicImpresso && s.dataSolicImpresso >= ninetyDaysAgo);
  }).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-medium border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{last7Days}</div>
              <div className="text-sm text-muted-foreground">Últimos 7 dias</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-medium border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{last30Days}</div>
              <div className="text-sm text-muted-foreground">Últimos 30 dias</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-medium border-0">
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{last90Days}</div>
              <div className="text-sm text-muted-foreground">Últimos 90 dias</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card className="shadow-medium border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Solicitações de Certificados - Últimos 30 dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="digital" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="Digital"
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
              />
              <Line 
                type="monotone" 
                dataKey="impresso" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                name="Impresso"
                dot={{ fill: "hsl(var(--success))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: "hsl(var(--success))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}