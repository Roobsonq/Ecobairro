import { useState, useEffect, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Clock } from "lucide-react";

export default function DisposalMap() {
  const disposalQuery = trpc.disposal.list.useQuery();
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [filterMaterial, setFilterMaterial] = useState<string>("");
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  const materials = [
    { value: "papel", label: "Papel e Papelão" },
    { value: "plástico", label: "Plástico" },
    { value: "vidro", label: "Vidro" },
    { value: "metal", label: "Metal" },
    { value: "eletrônicos", label: "Eletrônicos" },
    { value: "pilhas", label: "Pilhas e Baterias" },
    { value: "óleo", label: "Óleo de Cozinha" },
  ];

  const filteredPoints = filterMaterial
    ? disposalQuery.data?.filter(point =>
        (point.materialTypes as string[]).includes(filterMaterial)
      )
    : disposalQuery.data;

  // Inicializar mapa
  useEffect(() => {
    if (!mapRef.current && window.google) {
      const map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
        zoom: 14,
        center: { lat: -23.5505, lng: -46.6333 },
        styles: [
          { featureType: "water", elementType: "geometry", stylers: [{ color: "#e9e9e9" }] },
        ],
      });
      mapRef.current = map;
    }
  }, []);

  // Atualizar marcadores quando dados mudam
  useEffect(() => {
    if (!mapRef.current || !disposalQuery.data) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    disposalQuery.data.forEach(point => {
      const marker = new google.maps.Marker({
        position: {
          lat: parseFloat(point.latitude as string),
          lng: parseFloat(point.longitude as string),
        },
        map: mapRef.current,
        title: point.name,
      });

      marker.addListener("click", () => {
        setSelectedPoint(point);
      });

      markersRef.current.push(marker);
    });
  }, [disposalQuery.data]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-700">Pontos de Descarte</h1>
          <p className="text-gray-600">Encontre os ecopontos mais próximos para cada tipo de resíduo</p>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 border-green-100 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Material</h2>
              <div className="space-y-2">
                <button
                  onClick={() => setFilterMaterial("")}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    filterMaterial === ""
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Todos os Materiais
                </button>
                {materials.map(material => (
                  <button
                    key={material.value}
                    onClick={() => setFilterMaterial(material.value)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      filterMaterial === material.value
                        ? "bg-green-600 text-white"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                    }`}
                  >
                    {material.label}
                  </button>
                ))}
              </div>

              {/* Points List */}
              <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-4">
                Pontos Encontrados ({filteredPoints?.length || 0})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredPoints?.map(point => (
                  <button
                    key={point.id}
                    onClick={() => setSelectedPoint(point)}
                    className={`w-full text-left p-3 rounded-lg transition-colors border-2 ${
                      selectedPoint?.id === point.id
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white hover:border-green-300"
                    }`}
                  >
                    <p className="font-semibold text-gray-900 text-sm">{point.name}</p>
                    <p className="text-gray-600 text-xs mt-1">{point.neighborhood}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Map and Details */}
          <div className="lg:col-span-3">
            {/* Map */}
            <Card className="mb-6 border-green-100 overflow-hidden h-96">
              <div id="map" className="w-full h-full"></div>
            </Card>

            {/* Details */}
            {selectedPoint ? (
              <Card className="p-6 border-green-100">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedPoint.name}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="text-gray-900">{selectedPoint.address}</p>
                      <p className="text-gray-600 text-sm">{selectedPoint.neighborhood}</p>
                    </div>
                  </div>

                  {selectedPoint.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Telefone</p>
                        <p className="text-gray-900">{selectedPoint.phone}</p>
                      </div>
                    </div>
                  )}

                  {selectedPoint.operatingHours && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-600 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Horário de Funcionamento</p>
                        <p className="text-gray-900">{selectedPoint.operatingHours}</p>
                      </div>
                    </div>
                  )}

                  {selectedPoint.description && (
                    <div>
                      <p className="text-sm text-gray-600 mb-2">Descrição</p>
                      <p className="text-gray-900">{selectedPoint.description}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-600 mb-2">Materiais Aceitos</p>
                    <div className="flex flex-wrap gap-2">
                      {(selectedPoint.materialTypes as string[]).map(material => (
                        <span
                          key={material}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                        >
                          {material}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="p-12 text-center border-green-100">
                <p className="text-gray-600">Selecione um ponto de descarte para ver os detalhes</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
