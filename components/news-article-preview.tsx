import React from 'react';

export interface NewsArticlePreviewProps {
  headline: string;
  source: string;
  description: string;
  publishedDate: string;
  url?: string;
  imageUrl?: string;
  author?: string;
}

export function NewsArticlePreview({
  headline,
  source,
  description,
  publishedDate,
  url,
  imageUrl,
  author,
}: NewsArticlePreviewProps) {
  const content = (
    <div className="flex gap-4">
      {/* Image thumbnail if provided */}
      {imageUrl && (
        <div className="flex-shrink-0 w-32 h-32 bg-gray-800 rounded-lg overflow-hidden">
          <img 
            src={imageUrl} 
            alt={headline}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Article content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {headline}
        </h3>
        
        <p className="text-sm text-gray-400 mb-2 line-clamp-3">
          {description}
        </p>
        
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-blue-400">{source}</span>
          <span>•</span>
          <span>{publishedDate}</span>
          {author && (
            <>
              <span>•</span>
              <span>By {author}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );

  // If URL provided, make it clickable
  if (url) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full max-w-2xl mx-auto my-4 p-4 border border-gray-700 rounded-lg bg-gray-900 hover:bg-gray-800 hover:border-gray-600 transition-colors"
      >
        {content}
      </a>
    );
  }

  // Otherwise just a display card
  return (
    <div className="w-full max-w-2xl mx-auto my-4 p-4 border border-gray-700 rounded-lg bg-gray-900">
      {content}
    </div>
  );
}

