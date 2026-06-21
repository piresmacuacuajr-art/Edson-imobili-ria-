/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, Calendar, Eye, Share2, ArrowLeft, BookOpen, Clock, Heart } from 'lucide-react';
import { BlogArticle } from '../types';

interface BlogSectionProps {
  articles: BlogArticle[];
}

export default function BlogSection({ articles }: BlogSectionProps) {
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<string[]>([]);

  const [copiedNotification, setCopiedNotification] = useState(false);

  // Categories list
  const categories = ['Todos', 'Legislação', 'Comprar', 'Dicas', 'Tendências'];

  // Match category + query
  const filteredArticles = articles.filter((post) => {
    const matchesCategory = selectedCategory === 'Todos' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleLike = (articleId: string) => {
    if (likedList.includes(articleId)) {
      setLikedList(prev => prev.filter(id => id !== articleId));
      setLikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) - 1 }));
    } else {
      setLikedList(prev => [...prev, articleId]);
      setLikes(prev => ({ ...prev, [articleId]: (prev[articleId] || 0) + 1 }));
    }
  };

  const handleShare = (post: BlogArticle) => {
    // Simulated dynamic share API or clipboard copy
    const textToCopy = `Grupo Edson Imobiliária | LER ARTIGO: ${post.title} - Como visto no Grupo Edson`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNotification(true);
    setTimeout(() => {
      setCopiedNotification(false);
    }, 4000);
  };

  if (selectedArticle) {
    const articleLikes = (likes[selectedArticle.id] || 0);
    const isLiked = likedList.includes(selectedArticle.id);

    return (
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-6 text-white text-left animate-fade-in" id="blog-content-viewer">
        <button
          onClick={() => setSelectedArticle(null)}
          className="pb-4 text-xs font-bold text-[#d4af37] hover:brightness-110 flex items-center gap-1.5 cursor-pointer uppercase font-mono tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Artigos
        </button>

        <div className="aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 mb-6 bg-slate-950">
          <img
            src={selectedArticle.image}
            alt={selectedArticle.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-mono">
            <span className="px-2.5 py-1 rounded-full bg-[#d4af37]/10 text-[#d4af37] font-bold">
              {selectedArticle.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {selectedArticle.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {selectedArticle.readTime}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {selectedArticle.views + 1} Visualizações
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {selectedArticle.title}
          </h1>

          <p className="text-gray-300 text-sm italic font-medium leading-relaxed border-l-2 border-[#d4af37] pl-4">
            {selectedArticle.excerpt}
          </p>

          <div className="prose prose-invert max-w-none text-xs sm:text-sm text-gray-300 space-y-4 leading-relaxed pt-3">
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('###') || paragraph.startsWith('*') || paragraph.startsWith('1.')) {
                // simple render markdown subset
                if (paragraph.startsWith('###')) {
                  return (
                    <h3 key={idx} className="font-bold text-base text-white mt-5 mb-2 border-b border-white/5 pb-1">
                      {paragraph.replace('###', '').trim()}
                    </h3>
                  );
                }
                if (paragraph.startsWith('*') || paragraph.startsWith('1.')) {
                  return (
                    <div key={idx} className="pl-4 space-y-1 my-2">
                      {paragraph.split('\n').map((line, lIdx) => (
                        <p key={lIdx} className="text-gray-300">
                          {line.trim()}
                        </p>
                      ))}
                    </div>
                  );
                }
              }
              return <p key={idx} className="text-justify leading-relaxed">{paragraph}</p>;
            })}
          </div>

          <div className="border-t border-white/5 pt-6 flex items-center justify-between gap-4 mt-8">
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleLike(selectedArticle.id)}
                className={`py-2 px-4 rounded-xl flex items-center gap-1.5 text-xs transition ${
                  isLiked 
                    ? 'bg-red-500/10 border border-red-500/30 text-red-400' 
                    : 'bg-white/5 border border-white/5 text-gray-400 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                <span>Gostei ({articleLikes > 0 ? selectedArticle.views/3 + articleLikes : Math.round(selectedArticle.views/3)})</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => handleShare(selectedArticle)}
                  className="py-2 px-4 bg-white/5 border border-white/5 text-gray-400 hover:text-white rounded-xl flex items-center gap-1.5 text-xs transition active:scale-95"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Partilhar Link</span>
                </button>
                {copiedNotification && (
                  <span className="absolute left-0 -top-8 bg-emerald-500/90 text-slate-900 border border-emerald-400 font-extrabold text-[10px] py-1 px-2.5 rounded-lg animate-bounce whitespace-nowrap">
                    ✓ Link copiado!
                  </span>
                )}
              </div>
            </div>

            <span className="text-[10px] font-mono text-gray-500 italic">
              Grupo Edson Imobiliária Moçambique © 2026
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" id="blog-catalog-section">
      {/* Search and Category Filters */}
      <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Horizontal Category Pill buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-lg font-bold transition ${
                selectedCategory === cat
                  ? 'bg-[#d4af37] text-slate-900'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Input search box */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Pesquisar artigos do blog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/60 border border-white/10 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 focus:border-[#d4af37] focus:outline-none"
          />
        </div>

      </div>

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredArticles.map((post) => (
            <article 
              key={post.id} 
              onClick={() => setSelectedArticle(post)}
              className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-[#d4af37]/30 transition duration-300 group cursor-pointer flex flex-col justify-between text-left"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-[#d4af37] text-slate-900 font-extrabold text-[9px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {post.category}
                  </span>
                </div>
                
                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[10px] text-gray-500 font-mono">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {post.readTime}
                    </span>
                  </div>
                  
                  <h3 className="font-extrabold text-sm sm:text-base text-gray-100 group-hover:text-[#d4af37] transition duration-200 line-clamp-2">
                    {post.title}
                  </h3>
                  
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 mt-auto border-t border-white/5 flex items-center justify-between">
                <span className="text-xs group-hover:text-amber-400 text-gray-400 transition font-bold uppercase tracking-widest font-mono text-[10px] flex items-center gap-1 pt-3">
                  Ler Artigo Completo 
                  <BookOpen className="w-3.5 h-3.5" />
                </span>
                <span className="text-[10px] font-mono text-gray-500 flex items-center gap-1 pt-3">
                  <Eye className="w-3 h-3" /> {post.views} lidos
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-white/5 rounded-2xl p-12 text-center text-gray-400">
          <BookOpen className="w-10 h-10 text-gray-500 mx-auto opacity-40 mb-3" />
          <p className="text-xs font-mono">Nenhum artigo encontrado para os filtros selecionados.</p>
        </div>
      )}
    </div>
  );
}
