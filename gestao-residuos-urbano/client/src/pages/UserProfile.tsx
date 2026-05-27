import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { User, Mail, Phone, MapPin, LogOut, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    neighborhood: user?.neighborhood || "",
  });

  const updateUserMutation = trpc.users.update.useMutation({
    onSuccess: () => {
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error("Erro ao atualizar perfil: " + error.message);
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (user?.id) {
      await updateUserMutation.mutateAsync({
        userId: user.id,
        ...formData,
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  const handleBack = () => {
    if (user?.role === "morador") {
      setLocation("/morador/dashboard");
    } else {
      setLocation("/admin/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Meu Perfil</h1>
          </div>
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

      {/* Main Content */}
      <div className="container max-w-2xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="p-8 mb-8 bg-gradient-to-r from-blue-50 to-green-50 border-blue-100">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600 mt-1">
                {user?.role === "morador" && "Morador"}
                {user?.role === "prefeitura" && "Prefeitura/Administrador"}
                {user?.role === "cooperativa" && "Cooperativa de Reciclagem"}
              </p>
              {user?.role === "morador" && (
                <p className="text-green-600 font-semibold mt-2">
                  Pontuação: 1,250 pontos
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Profile Form */}
        <Card className="p-8 border-gray-200">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Informações Pessoais</h3>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? "default" : "outline"}
              size="sm"
            >
              {isEditing ? "Cancelar" : "Editar"}
            </Button>
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Telefone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="(11) 99999-9999"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-2" />
                Endereço
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Rua, número"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Neighborhood */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bairro
              </label>
              <input
                type="text"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Bairro"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-600"
              />
            </div>

            {/* Save Button */}
            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={updateUserMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {updateUserMutation.isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            )}
          </div>
        </Card>

        {/* Account Info */}
        <Card className="p-8 mt-8 border-gray-200 bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Informações da Conta</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID do Usuário:</span>
              <span className="text-gray-900 font-medium">#{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo de Conta:</span>
              <span className="text-gray-900 font-medium">
                {user?.role === "morador" && "Morador"}
                {user?.role === "prefeitura" && "Prefeitura/Administrador"}
                {user?.role === "cooperativa" && "Cooperativa de Reciclagem"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Membro desde:</span>
              <span className="text-gray-900 font-medium">
                {user?.createdAt && new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Último acesso:</span>
              <span className="text-gray-900 font-medium">
                {user?.lastSignedIn && new Date(user.lastSignedIn).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
