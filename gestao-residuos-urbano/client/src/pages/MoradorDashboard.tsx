import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Plus, MapPin, History, Award, LogOut } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function MoradorDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  const schedulesQuery = trpc.schedules.list.useQuery();
  const createScheduleMutation = trpc.schedules.create.useMutation();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleCreateSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await createScheduleMutation.mutateAsync({
        materialType: formData.get("materialType") as string,
        estimatedVolume: formData.get("estimatedVolume") as "pequeno" | "médio" | "grande",
        address: formData.get("address") as string,
        neighborhood: formData.get("neighborhood") as string,
        notes: formData.get("notes") as string,
      });
      setShowScheduleForm(false);
      schedulesQuery.refetch();
    } catch (error) {
      console.error("Erro ao criar agendamento:", error);
    }
  };

  const completedCount = schedulesQuery.data?.filter(s => s.status === "concluído").length || 0;
  const engagementScore = (completedCount * 10) + (user?.engagementScore || 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-700">EcoBairro</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Olá, {user?.name}</span>
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
            Bem-vindo, {user?.name}!
          </h1>
          <p className="text-gray-600">
            Gerencie seus agendamentos de coleta e acompanhe seu impacto na comunidade.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Coletas Agendadas</p>
                <p className="text-3xl font-bold text-green-600">
                  {schedulesQuery.data?.filter(s => s.status !== "concluído").length || 0}
                </p>
              </div>
              <MapPin className="w-12 h-12 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Coletas Concluídas</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <History className="w-12 h-12 text-green-100" />
            </div>
          </Card>

          <Card className="p-6 border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Pontuação de Engajamento</p>
                <p className="text-3xl font-bold text-green-600">{engagementScore}</p>
              </div>
              <Award className="w-12 h-12 text-green-100" />
            </div>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowScheduleForm(!showScheduleForm)}
            className="bg-green-600 hover:bg-green-700"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Agendar Nova Coleta
          </Button>
        </div>

        {/* Schedule Form */}
        {showScheduleForm && (
          <Card className="p-8 mb-8 border-green-200 bg-green-50">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Agendar Coleta</h2>
            <form onSubmit={handleCreateSchedule} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Material
                  </label>
                  <select 
                    name="materialType"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="papel">Papel e Papelão</option>
                    <option value="plástico">Plástico</option>
                    <option value="vidro">Vidro</option>
                    <option value="metal">Metal</option>
                    <option value="eletrônicos">Eletrônicos</option>
                    <option value="pilhas">Pilhas e Baterias</option>
                    <option value="óleo">Óleo de Cozinha</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Volume Estimado
                  </label>
                  <select 
                    name="estimatedVolume"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione um volume</option>
                    <option value="pequeno">Pequeno (até 10kg)</option>
                    <option value="médio">Médio (10-50kg)</option>
                    <option value="grande">Grande (mais de 50kg)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Endereço
                  </label>
                  <input 
                    type="text"
                    name="address"
                    required
                    placeholder="Rua, número e complemento"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bairro
                  </label>
                  <input 
                    type="text"
                    name="neighborhood"
                    required
                    placeholder="Nome do bairro"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações (opcional)
                  </label>
                  <textarea 
                    name="notes"
                    placeholder="Informações adicionais sobre a coleta"
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Confirmar Agendamento
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowScheduleForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Schedules List */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Meus Agendamentos</h2>
          
          {schedulesQuery.isLoading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Carregando agendamentos...</p>
            </div>
          ) : schedulesQuery.data && schedulesQuery.data.length > 0 ? (
            <div className="space-y-4">
              {schedulesQuery.data.map((schedule) => (
                <Card key={schedule.id} className="p-6 border-green-100 hover:border-green-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {schedule.materialType}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          schedule.status === "concluído" ? "bg-green-100 text-green-700" :
                          schedule.status === "confirmado" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {schedule.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        {schedule.address}, {schedule.neighborhood}
                      </p>
                      <p className="text-gray-500 text-sm">
                        Volume: {schedule.estimatedVolume}
                      </p>
                      {schedule.notes && (
                        <p className="text-gray-500 text-sm mt-2">
                          Observações: {schedule.notes}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {schedule.createdAt && new Date(schedule.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border-green-100">
              <p className="text-gray-600 mb-4">Você ainda não tem agendamentos.</p>
              <Button 
                onClick={() => setShowScheduleForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Agendamento
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
