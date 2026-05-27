import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Leaf, ArrowRight, MapPin, Users, TrendingUp, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (user?.role === "morador") {
      setLocation("/morador/dashboard");
    } else {
      setLocation("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-green-100">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span className="text-2xl font-bold text-green-700">EcoBairro</span>
          </div>
          <div className="flex gap-3">
            <Button onClick={handleGetStarted} className="bg-green-600 hover:bg-green-700">
              Acessar Plataforma
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Transforme seu Bairro em um Espaço Sustentável
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            EcoBairro conecta moradores, prefeitura e cooperativas de reciclagem para criar uma gestão inteligente de resíduos que beneficia toda a comunidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-lg px-8"
            >
              Começar Agora <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="text-lg px-8"
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            >
              Saiba Mais
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">+500kg</div>
            <p className="text-gray-600">Resíduos coletados mensalmente</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">+2.5k</div>
            <p className="text-gray-600">Moradores engajados</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-green-100 shadow-sm">
            <div className="text-4xl font-bold text-green-600 mb-2">+30%</div>
            <p className="text-gray-600">Aumento em reciclagem</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 border-t border-green-100">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Funcionalidades Principais
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Agendamento de Coleta</h3>
              <p className="text-gray-600">
                Agende a coleta de recicláveis diretamente pela plataforma com data e horário convenientes.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mapa de Pontos de Descarte</h3>
              <p className="text-gray-600">
                Encontre os ecopontos mais próximos para cada tipo de resíduo.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Educação Ambiental</h3>
              <p className="text-gray-600">
                Acesse dicas e conteúdo sobre como separar resíduos corretamente.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Painel de Métricas</h3>
              <p className="text-gray-600">
                Acompanhe o volume de material coletado e o impacto da comunidade.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Histórico de Coletas</h3>
              <p className="text-gray-600">
                Visualize seu histórico de agendamentos e acompanhe o status de cada coleta.
              </p>
            </div>

            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Painel Administrativo</h3>
              <p className="text-gray-600">
                Prefeitura e cooperativas gerenciam agendamentos e acessam relatórios.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Leaf className="w-6 h-6 text-green-500" />
            <span className="text-xl font-bold text-white">EcoBairro</span>
          </div>
          <p className="text-sm mb-8">
            Transformando bairros em comunidades sustentáveis através da gestão inteligente de resíduos.
          </p>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 EcoBairro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
