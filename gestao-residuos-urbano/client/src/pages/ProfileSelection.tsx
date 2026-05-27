import { useState } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building2, Leaf } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function ProfileSelection() {
  const [, setLocation] = useLocation();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  const roles = [
    {
      id: "morador",
      title: "Sou Morador",
      description: "Agende coletas de resíduos e acompanhe seu impacto na comunidade",
      icon: Users,
      color: "bg-green-50 border-green-200 hover:border-green-400",
      iconColor: "text-green-600",
    },
    {
      id: "prefeitura",
      title: "Sou da Prefeitura",
      description: "Gerencie agendamentos e visualize métricas de coleta",
      icon: Building2,
      color: "bg-blue-50 border-blue-200 hover:border-blue-400",
      iconColor: "text-blue-600",
    },
    {
      id: "cooperativa",
      title: "Sou da Cooperativa",
      description: "Coordene coletas e acompanhe o volume de resíduos processados",
      icon: Leaf,
      color: "bg-emerald-50 border-emerald-200 hover:border-emerald-400",
      iconColor: "text-emerald-600",
    },
  ];

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleContinue = () => {
    if (selectedRole) {
      const loginUrl = getLoginUrl();
      window.location.href = loginUrl;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bem-vindo ao EcoBairro
          </h1>
          <p className="text-xl text-gray-600">
            Escolha seu perfil para começar
          </p>
        </div>

        {/* Role Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {roles.map(role => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => handleSelectRole(role.id)}
                className={`transition-all transform hover:scale-105 ${
                  selectedRole === role.id ? "ring-2 ring-offset-2 ring-green-600" : ""
                }`}
              >
                <Card
                  className={`p-8 text-center border-2 cursor-pointer h-full ${
                    role.color
                  } ${selectedRole === role.id ? "ring-offset-0" : ""}`}
                >
                  <Icon className={`w-16 h-16 mx-auto mb-4 ${role.iconColor}`} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{role.description}</p>
                  {selectedRole === role.id && (
                    <div className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium">
                      Selecionado
                    </div>
                  )}
                </Card>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => setLocation("/")}
            variant="outline"
            size="lg"
            className="px-8"
          >
            Voltar
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selectedRole}
            className="bg-green-600 hover:bg-green-700 px-8"
            size="lg"
          >
            Continuar
          </Button>
        </div>

        {/* Info Text */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p>
            Você pode alterar seu perfil a qualquer momento nas configurações da conta.
          </p>
        </div>
      </div>
    </div>
  );
}
