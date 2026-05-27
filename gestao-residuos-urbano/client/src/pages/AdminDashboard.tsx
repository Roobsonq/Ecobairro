import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart3, TrendingUp, Users, Package, LogOut, Check, Clock, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const schedulesQuery = trpc.schedules.listAll.useQuery();
  const metricsQuery = trpc.metrics.getCurrentMonth.useQuery();
  const updateStatusMutation = trpc.schedules.updateStatus.useMutation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const filteredSchedules = filterStatus
    ? schedulesQuery.data?.filter(s => s.status === filterStatus)
    : schedulesQuery.data;

  const pendingCount = schedulesQuery.data?.filter(s => s.status === "pendente").length || 0;
  const confirmedCount = schedulesQuery.data?.filter(s => s.status === "confirmado").length || 0;
  const completedCount = schedulesQuery.data?.filter(s => s.status === "concluído").length || 0;

  const handleUpdateStatus = async (scheduleId: number, newStatus: string) => {
    setUpdatingId(scheduleId);
    try {
      await updateStatusMutation.mutateAsync({
        id: scheduleId,
        status: newStatus as "pendente" | "confirmado" | "concluído",
      });
      schedulesQuery.refetch();
      setSelectedScheduleId(null);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-blue-100 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-blue-700">EcoBairro Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.role === "prefeitura" ? "Prefeitura" : "Cooperativa"} - {user?.name}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Painel de Controle
          </h1>
          <p className="text-gray-600">
            Gerencie agendamentos e acompanhe as métricas de coleta de resíduos.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Agendamentos Pendentes</p>
                <p className="text-3xl font-bold text-blue-600">{pendingCount}</p>
              </div>
              <Package className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Agendamentos Confirmados</p>
                <p className="text-3xl font-bold text-blue-600">{confirmedCount}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Coletas Concluídas</p>
                <p className="text-3xl font-bold text-blue-600">{completedCount}</p>
              </div>
              <BarChart3 className="w-12 h-12 text-blue-100" />
            </div>
          </Card>

          <Card className="p-6 border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total de Agendamentos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {schedulesQuery.data?.length || 0}
                </p>
              </div>
              <Users className="w-12 h-12 text-blue-100" />
            </div>
          </Card>
        </div>

        {/* Metrics Section */}
        {metricsQuery.data && (
          <Card className="p-8 mb-8 border-blue-100 bg-blue-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Métricas do Mês</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Volume Total Coletado</p>
                <p className="text-3xl font-bold text-blue-600">
                  {metricsQuery.data.totalVolumeCollected} kg
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Aumento Percentual</p>
                <p className="text-3xl font-bold text-green-600">
                  +{metricsQuery.data.percentageIncrease}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Usuários Ativos</p>
                <p className="text-3xl font-bold text-blue-600">
                  {metricsQuery.data.activeUsers}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Filters */}
        <div className="mb-6 flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilterStatus("")}
            variant={filterStatus === "" ? "default" : "outline"}
            className={filterStatus === "" ? "bg-blue-600" : ""}
          >
            Todos
          </Button>
          <Button
            onClick={() => setFilterStatus("pendente")}
            variant={filterStatus === "pendente" ? "default" : "outline"}
            className={filterStatus === "pendente" ? "bg-yellow-600" : ""}
          >
            Pendentes
          </Button>
          <Button
            onClick={() => setFilterStatus("confirmado")}
            variant={filterStatus === "confirmado" ? "default" : "outline"}
            className={filterStatus === "confirmado" ? "bg-blue-600" : ""}
          >
            Confirmados
          </Button>
          <Button
            onClick={() => setFilterStatus("concluído")}
            variant={filterStatus === "concluído" ? "default" : "outline"}
            className={filterStatus === "concluído" ? "bg-green-600" : ""}
          >
            Concluídos
          </Button>
        </div>

        {/* Schedules Table */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Agendamentos ({filteredSchedules?.length || 0})</h2>
          
          {schedulesQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando agendamentos...</p>
            </div>
          ) : schedulesQuery.data && schedulesQuery.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-blue-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">ID</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Material</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Endereço</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Volume</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Data</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSchedules?.map((schedule) => (
                    <tr key={schedule.id} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                      <td className="py-4 px-4 text-gray-900">#{schedule.id}</td>
                      <td className="py-4 px-4 text-gray-900">{schedule.materialType}</td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {schedule.address}
                      </td>
                      <td className="py-4 px-4 text-gray-600">{schedule.estimatedVolume}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          schedule.status === "concluído" ? "bg-green-100 text-green-700" :
                          schedule.status === "confirmado" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600 text-sm">
                        {schedule.createdAt && new Date(schedule.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          {schedule.status !== "confirmado" && (
                            <Button
                              onClick={() => handleUpdateStatus(schedule.id, "confirmado")}
                              disabled={updatingId === schedule.id}
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Confirmar
                            </Button>
                          )}
                          {schedule.status !== "concluído" && (
                            <Button
                              onClick={() => handleUpdateStatus(schedule.id, "concluído")}
                              disabled={updatingId === schedule.id}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Concluir
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Card className="p-12 text-center border-blue-100">
              <p className="text-gray-600">Nenhum agendamento encontrado.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
