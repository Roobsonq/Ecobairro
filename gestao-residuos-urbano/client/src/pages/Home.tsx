import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { Leaf, MapPin, Users, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { isAuthenticated, user } = useAuth();
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      if (user?.role === "morador") {
        setLocation("/morador/dashboard");
      } else if (user?.role === "prefeitura" || user?.role === "cooperativa") {
        setLocation("/admin/dashboard");
      }
    } else {
      setLocation("/profile-selection");
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
            {isAuthenticated ? (
              <Button onClick={() => setLocation("/morador/dashboard")} variant="default">
                Acessar Plataforma
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => window.location.href = getLoginUrl()}>
                  Entrar
                </Button>
                <Button onClick={() => window.location.href = getLoginUrl()} className="bg-green-600 hover:bg-green-700">
                  Cadastrar
                </Button>
              </>
            )}
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
            {/* Feature 1 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Agendamento de Coleta</h3>
              <p className="text-gray-600">
                Agende a coleta de recicláveis diretamente pela plataforma com data e horário convenientes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mapa de Pontos de Descarte</h3>
              <p className="text-gray-600">
                Encontre os ecopontos mais próximos para cada tipo de resíduo (eletrônicos, pilhas, óleo, etc).
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Educação Ambiental</h3>
              <p className="text-gray-600">
                Acesse dicas e conteúdo sobre como separar resíduos corretamente e benefícios da reciclagem.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Painel de Métricas</h3>
              <p className="text-gray-600">
                Acompanhe o volume de material coletado e o impacto da comunidade em tempo real.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Histórico de Coletas</h3>
              <p className="text-gray-600">
                Visualize seu histórico de agendamentos e acompanhe o status de cada coleta realizada.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-8 rounded-lg border border-green-100 hover:border-green-300 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Painel Administrativo</h3>
              <p className="text-gray-600">
                Prefeitura e cooperativas gerenciam agendamentos e acessam relatórios de desempenho.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-green-50 py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Como Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Cadastre-se</h3>
              <p className="text-gray-600">
                Crie sua conta como Morador, Prefeitura ou Cooperativa
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Agende</h3>
              <p className="text-gray-600">
                Solicite a coleta de seus recicláveis com poucos cliques
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Colete</h3>
              <p className="text-gray-600">
                Receba a coleta no dia e horário agendados
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Impacte</h3>
              <p className="text-gray-600">
                Veja o impacto da sua ação na comunidade
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-16">
        <div className="container max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Pronto para fazer a diferença?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se à comunidade EcoBairro e ajude a transformar seu bairro em um espaço mais sustentável.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-white text-green-600 hover:bg-green-50 text-lg px-8"
          >
            Comece Agora <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold text-white">EcoBairro</span>
              </div>
              <p className="text-sm">
                Transformando bairros em comunidades sustentáveis através da gestão inteligente de resíduos.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Preços</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Sobre</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Blog</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500 transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Termos</a></li>
                <li><a href="#" className="hover:text-green-500 transition">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 EcoBairro. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
