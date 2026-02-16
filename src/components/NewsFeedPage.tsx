import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark,
  BookmarkCheck,
  Share2,
  TrendingUp,
  DollarSign,
  Rocket,
  Award,
  Newspaper,
  ChevronDown,
  X,
  Filter,
  Check,
  ExternalLink,
  Copy,
  MessageSquare,
  ThumbsUp,
  Eye,
  Clock,
  ChevronLeft,
  Hash,
  Globe,
  Twitter,
  Linkedin,
  Facebook,
  Send,
  RefreshCw,
  MoreVertical,
  ArrowLeft,
  ChevronRight
} from 'lucide-react';
import { brandColors } from '../utils/colors';
import api from '../services/api';
import { useEffect } from 'react';

interface NewsArticle {
  id: string;
  _id?: string;
  headline: string;
  summary: string;
  content: string;
  category: 'funding' | 'product-launch' | 'market-trends' | 'acquisition' | 'industry-news';
  source: {
    name: string;
    logo: string;
  };
  author?: string;
  publishDate: string;
  readTime: string;
  image?: string;
  isBookmarked: boolean;
  views: number;
  location: string;
  industries: string[];
}

export function NewsFeedPage() {
  const [activeTab, setActiveTab] = useState<'personalized' | 'trending' | 'saved'>('personalized');
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('global');
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [bookmarkedArticles, setBookmarkedArticles] = useState<string[]>([]);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Fetch articles from API
  useEffect(() => {
    fetchArticles();
  }, [selectedCategories, selectedLocation, selectedIndustries]);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (selectedCategories.length > 0) params.category = selectedCategories[0];
      if (selectedLocation !== 'global') params.location = selectedLocation;
      if (selectedIndustries.length > 0) params.industry = selectedIndustries[0];
      
      const resp = await api.get('/news', { params });
      const mapped = (resp.data as any[]).map((article: any) => ({
        ...article,
        id: article._id || String(article.id),
        publishDate: article.publishDate 
          ? new Date(article.publishDate).toLocaleDateString()
          : article.publishDate,
        source: {
          name: article.source?.name || 'News Source',
          logo: article.source?.logo || 'NS'
        }
      }));
      setArticles(mapped);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load news articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchTrendingTopics = async () => {
    try {
      const resp = await api.get('/news/trending');
      return resp.data as { tag: string; count: number }[];
    } catch {
      return [];
    }
  };

  const categories = [
    { id: 'funding', label: 'Funding Announcements', icon: DollarSign, color: '#10B981' },
    { id: 'product-launch', label: 'Product Launches', icon: Rocket, color: brandColors.atomicOrange },
    { id: 'market-trends', label: 'Market Trends', icon: TrendingUp, color: brandColors.electricBlue },
    { id: 'acquisition', label: 'Acquisitions & Exits', icon: Award, color: '#8B5CF6' },
    { id: 'industry-news', label: 'Industry News', icon: Newspaper, color: '#6B7280' },
  ];

  const locations = [
    { value: 'global', label: 'Global' },
    { value: 'india', label: 'India' },
    { value: 'us', label: 'United States' },
    { value: 'europe', label: 'Europe' },
    { value: 'asia', label: 'Asia' },
  ];

  const industries = [
    'SaaS', 'FinTech', 'HealthTech', 'EdTech', 'E-commerce', 
    'AI/ML', 'Blockchain', 'CleanTech', 'AgriTech', 'Marketing'
  ];

  const trendingTopics = [
    { tag: 'AI', count: 245 },
    { tag: 'Funding', count: 189 },
    { tag: 'SaaS', count: 156 },
    { tag: 'FinTech', count: 134 },
    { tag: 'Startups', count: 298 },
    { tag: 'Investment', count: 167 },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry)
        ? prev.filter(i => i !== industry)
        : [...prev, industry]
    );
  };

  const toggleBookmark = (articleId: string) => {
    setBookmarkedArticles(prev =>
      prev.includes(articleId)
        ? prev.filter(id => id !== articleId)
        : [...prev, articleId]
    );
  };

  const getCategoryColor = (category: string) => {
    return categories.find(c => c.id === category)?.color || '#6B7280';
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || Newspaper;
  };

  const getCategoryLabel = (category: string) => {
    return categories.find(c => c.id === category)?.label || 'News';
  };

  if (selectedArticle) {
    return (
      <ArticleDetailPage
        article={selectedArticle}
        onBack={() => setSelectedArticle(null)}
        isBookmarked={bookmarkedArticles.includes(selectedArticle.id)}
        onToggleBookmark={() => toggleBookmark(selectedArticle.id)}
        relatedArticles={articles.slice(0, 4)}
        trendingTopics={trendingTopics}
      />
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Filter Popup */}
      <AnimatePresence>
        {showFilters && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setShowFilters(false)}
            />
            
            {/* Filter Panel */}
            <motion.aside
              initial={{ x: 384 }}
              animate={{ x: 0 }}
              exit={{ x: 384 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-screen w-96 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3">Categories</h3>
                  <div className="space-y-2">
                    {categories.map(category => {
                      const Icon = category.icon;
                      return (
                        <label
                          key={category.id}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(category.id)}
                            onChange={() => toggleCategory(category.id)}
                            className="w-4 h-4 rounded"
                            style={{ accentColor: category.color }}
                          />
                          <Icon className="w-5 h-5" style={{ color: category.color }} />
                          <span className="flex-1 text-sm group-hover:text-gray-900">{category.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Location */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3">Location</h3>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      {locations.map(location => (
                        <option key={location.value} value={location.value}>
                          {location.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Industry Tags */}
                <div className="mb-6">
                  <h3 className="font-bold text-sm mb-3">Industry Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {industries.map(industry => (
                      <button
                        key={industry}
                        onClick={() => toggleIndustry(industry)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          selectedIndustries.includes(industry)
                            ? 'text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                        style={selectedIndustries.includes(industry) ? { backgroundColor: brandColors.electricBlue } : {}}
                      >
                        {industry}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Apply Filters Button */}
                {(selectedCategories.length > 0 || selectedIndustries.length > 0 || selectedLocation !== 'global') && (
                  <div className="space-y-2">
                    <button
                      onClick={() => setShowFilters(false)}
                      className="w-full py-3 rounded-lg font-bold text-white hover:shadow-md transition-all"
                      style={{ backgroundColor: brandColors.electricBlue }}
                    >
                      Apply Filters
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCategories([]);
                        setSelectedIndustries([]);
                        setSelectedLocation('global');
                      }}
                      className="w-full py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto px-4 lg:px-8 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {[
                  { key: 'personalized', label: 'Personalized', icon: TrendingUp },
                  { key: 'trending', label: 'Trending', icon: TrendingUp },
                  { key: 'saved', label: 'Saved', icon: Bookmark },
                ].map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                        activeTab === tab.key
                          ? 'text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                      style={activeTab === tab.key ? { backgroundColor: brandColors.electricBlue } : {}}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Filter Button - Both Mobile & Desktop */}
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">Filters</span>
              </button>
            </div>

            {/* Active Filters Display */}
            {(selectedCategories.length > 0 || selectedIndustries.length > 0) && (
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(catId => {
                  const category = categories.find(c => c.id === catId);
                  return (
                    <span
                      key={catId}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                      style={{ backgroundColor: category?.color }}
                    >
                      {category?.label}
                      <button onClick={() => toggleCategory(catId)} className="ml-1">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
                {selectedIndustries.map(industry => (
                  <span
                    key={industry}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: brandColors.electricBlue }}
                  >
                    {industry}
                    <button onClick={() => toggleIndustry(industry)} className="ml-1">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* News Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
          {error && (
            <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-100 text-red-700">
              {error}
            </div>
          )}
          {loading && (
            <div className="mb-4 p-4 rounded-lg bg-gray-100 border border-gray-200 text-gray-700">
              Loading news articles...
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {articles.map((article, index) => {
              const CategoryIcon = getCategoryIcon(article.category);
              const isBookmarked = bookmarkedArticles.includes(article.id);

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all group cursor-pointer"
                  onClick={() => setSelectedArticle(article)}
                >
                  {/* Image Thumbnail */}
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                      }} />
                    </div>

                    {/* Source Logo */}
                    <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-xs font-bold">
                        {article.source.logo}
                      </div>
                      <span className="text-sm font-medium">{article.source.name}</span>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(article.id);
                      }}
                      className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-5 h-5" style={{ color: brandColors.atomicOrange }} />
                      ) : (
                        <Bookmark className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    {/* Read Article button - appears on hover */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-6 py-3 bg-white rounded-lg font-bold text-gray-900 hover:bg-gray-100 transition-colors">
                        Read Article
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category Tag */}
                    <div
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-3"
                      style={{ backgroundColor: getCategoryColor(article.category) }}
                    >
                      <CategoryIcon className="w-3.5 h-3.5" />
                      {getCategoryLabel(article.category)}
                    </div>

                    {/* Headline */}
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-3 group-hover:text-blue-600 transition-colors">
                      {article.headline}
                    </h3>

                    {/* Summary */}
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {article.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {article.publishDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.views.toLocaleString()}
                        </span>
                      </div>
                      <span>{article.readTime} read</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

// Article Detail Page Component
function ArticleDetailPage({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  relatedArticles,
  trendingTopics,
}: {
  article: NewsArticle;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  relatedArticles: NewsArticle[];
  trendingTopics: { tag: string; count: number }[];
}) {
  const [shareThoughts, setShareThoughts] = useState('');
  const [showShareMenu, setShowShareMenu] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const CategoryIcon = article.category === 'funding' ? DollarSign :
    article.category === 'product-launch' ? Rocket :
    article.category === 'market-trends' ? TrendingUp :
    article.category === 'acquisition' ? Award : Newspaper;

  const shareToSocial = (platform: string) => {
    console.log(`Sharing to ${platform}`);
    // Implementation for social sharing
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    // Show toast notification
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 280; // card width (256px) + gap (16px)
      const newScrollLeft = scrollContainerRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Share Bar - Desktop Sticky Left */}
      <div className="hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-30">
        <button
          onClick={() => shareToSocial('linkedin')}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-500 transition-colors"
          title="Share on LinkedIn"
        >
          <Linkedin className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={() => shareToSocial('twitter')}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-400 transition-colors"
          title="Share on Twitter"
        >
          <Twitter className="w-5 h-5 text-blue-400" />
        </button>
        <button
          onClick={() => shareToSocial('facebook')}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-600 transition-colors"
          title="Share on Facebook"
        >
          <Facebook className="w-5 h-5 text-blue-600" />
        </button>
        <button
          onClick={copyLink}
          className="w-12 h-12 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
          title="Copy Link"
        >
          <Copy className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
        {/* Back Button */}
        <div className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-20">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to News</span>
          </button>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
          <div className="flex gap-8">
            {/* Article Content - Center Column */}
            <article className="flex-1 max-w-3xl">
              <div className="bg-white rounded-xl p-8 lg:p-12 border border-gray-200">
                {/* Category & Source */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-white text-sm font-bold">
                      {article.source.logo}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{article.source.name}</p>
                      {article.author && (
                        <p className="text-xs text-gray-600">by {article.author}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={onToggleBookmark}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="w-6 h-6" style={{ color: brandColors.atomicOrange }} />
                    ) : (
                      <Bookmark className="w-6 h-6 text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Headline */}
                <h1 className="lg:text-5xl font-bold leading-tight mb-4 text-[24px]">
                  {article.headline}
                </h1>

                {/* Meta Info */}
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.publishDate}
                  </span>
                  <span className="hidden md:inline">•</span>
                  <span>{article.readTime} read</span>
                  <span className="hidden md:inline">•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {article.views.toLocaleString()} views
                  </span>
                </div>

                {/* Featured Image */}
                <div className="relative h-96 rounded-xl overflow-hidden mb-8 bg-gradient-to-br from-blue-500 to-purple-600">
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'radial-gradient(circle, white 2px, transparent 2px)',
                      backgroundSize: '30px 30px'
                    }} />
                  </div>
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl text-gray-700 leading-relaxed mb-6">
                    {article.summary}
                  </p>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>

                  <h2 className="text-2xl font-bold mt-8 mb-4">Key Highlights</h2>
                  <ul className="space-y-2 mb-6">
                    <li>Strategic investment aimed at expanding market presence</li>
                    <li>Expected to create 500+ new jobs in the tech sector</li>
                    <li>Plans to launch three new products in Q2 2026</li>
                    <li>Partnership with leading industry players announced</li>
                  </ul>

                  <p className="text-gray-700 leading-relaxed mb-4">
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                  </p>

                  <blockquote className="border-l-4 pl-6 py-4 my-6 italic text-gray-700" style={{ borderColor: brandColors.electricBlue }}>
                    "This represents a significant milestone in our journey to transform the industry and create lasting value for our stakeholders."
                    <footer className="mt-2 text-sm font-bold not-italic">— {article.author || 'Company Spokesperson'}</footer>
                  </blockquote>

                  <h2 className="text-2xl font-bold mt-8 mb-4">What This Means</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    The implications of this development extend far beyond immediate financial gains. Industry experts predict that this move will set new standards for innovation and collaboration in the sector.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Looking ahead, stakeholders can expect continued growth and strategic initiatives that will shape the future of the industry landscape for years to come.
                  </p>
                </div>

                {/* Related Links */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="font-bold text-lg mb-4">Related Links</h3>
                  <div className="space-y-2">
                    {['Official Press Release', 'Company Statement', 'Industry Analysis Report'].map((link, i) => (
                      <a
                        key={i}
                        href="#"
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm font-medium text-blue-600">{link}</span>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </article>

            {/* Right Sidebar - Desktop */}
            <aside className="hidden lg:block w-96 space-y-6">
              {/* Share to Feed Widget */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Share to Your Feed</h3>
                <textarea
                  value={shareThoughts}
                  onChange={(e) => setShareThoughts(e.target.value)}
                  placeholder="Add your thoughts..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                  rows={4}
                />
                <button
                  className="w-full py-3 rounded-lg font-bold text-white hover:shadow-md transition-all flex items-center justify-center gap-2"
                  style={{ backgroundColor: brandColors.electricBlue }}
                >
                  <Send className="w-4 h-4" />
                  Post with Commentary
                </button>

                {/* Preview */}
                {shareThoughts && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm mb-2">{shareThoughts}</p>
                      <div className="p-2 bg-white rounded border border-gray-200">
                        <p className="text-xs font-bold line-clamp-1">{article.headline}</p>
                        <p className="text-xs text-gray-500">{article.source.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Related News */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <h3 className="font-bold text-lg mb-4">Related News</h3>
                <div className="space-y-4">
                  {relatedArticles.map(related => (
                    <div
                      key={related.id}
                      className="flex gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-2 mb-1">
                          {related.headline}
                        </p>
                        <p className="text-xs text-gray-500">{related.source.name}</p>
                        <p className="text-xs text-gray-500">{related.publishDate}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5" style={{ color: brandColors.atomicOrange }} />
                  <h3 className="font-bold text-lg">Trending Topics</h3>
                </div>
                <div className="space-y-2">
                  {trendingTopics.map((topic, i) => (
                    <button
                      key={i}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-gray-600" />
                        <span className="font-medium text-sm">{topic.tag}</span>
                      </div>
                      <span className="text-xs text-gray-500">{topic.count} posts</span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* Related Articles - Mobile Horizontal Scroll */}
        <div className="lg:hidden px-4 py-6 bg-white border-t border-gray-200">
          <h3 className="font-bold text-lg mb-4">Related News</h3>
          <div className="flex gap-4 overflow-x-auto pb-4" ref={scrollContainerRef}>
            {relatedArticles.map(related => (
              <div
                key={related.id}
                className="flex-shrink-0 w-64 bg-gray-50 rounded-lg p-3"
              >
                <div className="w-full h-32 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 mb-3" />
                <p className="font-medium text-sm line-clamp-2 mb-2">
                  {related.headline}
                </p>
                <p className="text-xs text-gray-500">{related.source.name} • {related.publishDate}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-between px-4">
            <button
              onClick={() => scroll('left')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Bottom Sticky Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <div className="flex items-center justify-around">
          <button
            onClick={() => setShowShareMenu(true)}
            className="flex flex-col items-center gap-1"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-medium">Share</span>
          </button>
          <button
            onClick={onToggleBookmark}
            className="flex flex-col items-center gap-1"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-5 h-5" style={{ color: brandColors.atomicOrange }} />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
            <span className="text-xs font-medium">Save</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <MessageSquare className="w-5 h-5" />
            <span className="text-xs font-medium">Comment</span>
          </button>
        </div>
      </div>
    </div>
  );
}