import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { BookOpen, Lightbulb } from "lucide-react";

export default function Education() {
  const educationQuery = trpc.education.list.useQuery();
  const categoriesQuery = trpc.education.categories.useQuery();
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const filteredContent = selectedCategory
    ? educationQuery.data?.filter(item => item.category === selectedCategory)
    : educationQuery.data;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-100 sticky top-0 z-40">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen className="w-8 h-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-700">Educação Ambiental</h1>
          </div>
          <p className="text-gray-600">Aprenda sobre reciclagem e sustentabilidade</p>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Categorias</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedCategory("")}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === ""
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200"
              }`}
            >
              Todos
            </button>
            {categoriesQuery.data?.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {educationQuery.isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Carregando conteúdo...</p>
          </div>
        ) : filteredContent && filteredContent.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContent.map(item => (
              <Card key={item.id} className="overflow-hidden border-green-100 hover:border-green-300 transition-colors">
                {item.imageUrl && (
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                  <div className="prose prose-sm max-w-none text-gray-700">
                    <p>{item.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-green-100">
            <p className="text-gray-600">Nenhum conteúdo encontrado nesta categoria.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
