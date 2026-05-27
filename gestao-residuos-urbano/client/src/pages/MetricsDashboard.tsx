import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { BarChart3, TrendingUp, LogOut, ArrowUp } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function MetricsDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const metricsQuery = trpc.metrics.getCurrentMonth.useQuery();

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  // Dados simulados para gráficos
  const monthlyData = [
    { month: "Jan", volume: 450, target: 500 },
    { month: "Fev", volume: 520, target: 500 },
    { month: "Mar", volume: 620, target: 500 },
    { month: "Abr", volume: 750, target: 500 },
    { month: "Mai", volume: 890, target: 500 },
  ];

  const materialData = [
    { name: "Papel", value: 350 },
    { name: "Plástico", value: 280 },
    { name: "Vidro", value: 200 },
    { name: "Metal", value: 150 },
    { name: "Eletrônicos", value: 100 },
  ];

  const metrics = metricsQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-900">Dashboard de Métricas</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.name}</span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Volume Coletado (mês)</p>
                <h3 className="text-3xl font-bold text-green-700">
                  {metrics?.totalVolumeCollected || "0"} kg
                </h3>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Aumento Percentual</p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {metrics?.percentageIncrease || "0"}%
                </h3>
              </div>
              <ArrowUp className="w-8 h-8 text-blue-600" />
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">Agendamentos</p>
              <h3 className="text-3xl font-bold text-purple-700">
                {metrics?.totalSchedules || "0"}
              </h3>
              <p className="text-xs text-gray-500 mt-2">
                {metrics?.completedSchedules || "0"} concluídos
              </p>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <div>
              <p className="text-sm text-gray-600 mb-2">Usuários Ativos</p>
              <h3 className="text-3xl font-bold text-orange-700">
                {metrics?.activeUsers || "0"}
              </h3>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Volume Trend */}
          <Card className="p-6 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Tendência de Coleta</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#16a34a" 
                  strokeWidth={2}
                  name="Volume Coletado"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Meta"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Material Distribution */}
          <Card className="p-6 border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Distribuição por Material</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={materialData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#16a34a" name="Volume (kg)" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Detailed Metrics Table */}
        <Card className="p-6 border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Resumo Detalhado</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Métrica</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Valor</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-900">Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Volume Total Coletado</td>
                  <td className="py-4 px-4 text-green-600 font-semibold">
                    {metrics?.totalVolumeCollected || "0"} kg
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Quantidade total de resíduos coletados no mês
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Volume Base</td>
                  <td className="py-4 px-4 text-blue-600 font-semibold">
                    {metrics?.baselineVolume || "0"} kg
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Volume de referência do mês anterior
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Aumento Percentual</td>
                  <td className="py-4 px-4 text-purple-600 font-semibold">
                    +{metrics?.percentageIncrease || "0"}%
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Crescimento em relação ao período anterior
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Total de Agendamentos</td>
                  <td className="py-4 px-4 text-orange-600 font-semibold">
                    {metrics?.totalSchedules || "0"}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Quantidade de coletas agendadas
                  </td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Agendamentos Concluídos</td>
                  <td className="py-4 px-4 text-green-600 font-semibold">
                    {metrics?.completedSchedules || "0"}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Coletas finalizadas com sucesso
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">Usuários Ativos</td>
                  <td className="py-4 px-4 text-blue-600 font-semibold">
                    {metrics?.activeUsers || "0"}
                  </td>
                  <td className="py-4 px-4 text-gray-600 text-sm">
                    Moradores engajados na plataforma
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
