import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProcessedStudent } from "@/types/student";
import { Search, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface StudentTableProps {
  students: ProcessedStudent[];
}

export function StudentTable({ students }: StudentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<ProcessedStudent | null>(null);

  const filteredStudents = students.filter(
    (student) =>
      student.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cpf.includes(searchTerm)
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "OK":
        return <Badge className="bg-success text-success-foreground">✅ OK</Badge>;
      case "X":
        return <Badge variant="destructive">❌ Pendente</Badge>;
      default:
        return <Badge variant="secondary">⚠️ N/E</Badge>;
    }
  };

  const getInadimplenciaBadge = (categoria: string) => {
    switch (categoria) {
      case "Em dia":
        return <Badge className="bg-success text-success-foreground">Em dia</Badge>;
      case "Atraso leve":
        return <Badge className="bg-warning text-warning-foreground">Atraso leve</Badge>;
      case "Atraso médio":
        return <Badge variant="secondary">Atraso médio</Badge>;
      default:
        return <Badge variant="destructive">Inadimplente</Badge>;
    }
  };

  return (
    <Card className="shadow-medium border-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold">Lista de Alunos</CardTitle>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>CPF</TableHead>
                <TableHead>Curso</TableHead>
                <TableHead>Financeiro</TableHead>
                <TableHead>Disciplinas</TableHead>
                <TableHead>Situação</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{student.nome}</TableCell>
                  <TableCell className="font-mono text-sm">{student.cpf}</TableCell>
                  <TableCell className="text-sm">{student.curso}</TableCell>
                  <TableCell>{getStatusBadge(student.financeiro)}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">
                        {student.disciplinasCompletas}/{student.disciplinasTotal}
                      </span>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${student.disciplinasPercentual}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getInadimplenciaBadge(student.inadimplenciaCategoria)}</TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          Ver detalhes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Detalhes do Aluno</DialogTitle>
                        </DialogHeader>
                        {selectedStudent && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-primary">Informações Pessoais</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Nome:</span> {selectedStudent.nome}</p>
                                <p><span className="font-medium">CPF:</span> {selectedStudent.cpf}</p>
                                <p><span className="font-medium">Curso:</span> {selectedStudent.curso}</p>
                                <p><span className="font-medium">Turma:</span> {selectedStudent.turma || "N/A"}</p>
                                <p><span className="font-medium">Status:</span> {selectedStudent.statusInscricao}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-semibold text-primary">Status Acadêmico</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Financeiro:</span> {getStatusBadge(selectedStudent.financeiro)}</p>
                                <p><span className="font-medium">Avaliação:</span> {getStatusBadge(selectedStudent.avaliacao)}</p>
                                <p><span className="font-medium">Tempo mínimo:</span> {getStatusBadge(selectedStudent.tempoMinimo)}</p>
                                <p><span className="font-medium">Documentos:</span> {getStatusBadge(selectedStudent.documentos)}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-semibold text-primary">Progresso</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Disciplinas:</span> {selectedStudent.disciplinasCompletas}/{selectedStudent.disciplinasTotal} ({selectedStudent.disciplinasPercentual.toFixed(1)}%)</p>
                                <p><span className="font-medium">Cobranças:</span> {selectedStudent.cobrancasPagas}/{selectedStudent.cobrancasTotal} ({selectedStudent.cobrancasPercentual.toFixed(1)}%)</p>
                                <p><span className="font-medium">Situação financeira:</span> {getInadimplenciaBadge(selectedStudent.inadimplenciaCategoria)}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <h4 className="font-semibold text-primary">Certificados</h4>
                              <div className="text-sm space-y-1">
                                <p><span className="font-medium">Digital:</span> {selectedStudent.statusCartDigital}</p>
                                <p><span className="font-medium">Impresso:</span> {selectedStudent.statusCartImpresso}</p>
                                {selectedStudent.dataSolicDigital && (
                                  <p><span className="font-medium">Data digital:</span> {selectedStudent.dataSolicDigital.toLocaleDateString()}</p>
                                )}
                                {selectedStudent.dataSolicImpresso && (
                                  <p><span className="font-medium">Data impresso:</span> {selectedStudent.dataSolicImpresso.toLocaleDateString()}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? "Nenhum aluno encontrado com os critérios de busca." : "Nenhum aluno cadastrado."}
          </div>
        )}
      </CardContent>
    </Card>
  );
}