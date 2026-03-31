import React from 'react';
import { Image } from '../typescript/action';
import NextImage from 'next/image'; // Recommended for Next.js
import { Image as ContentstackImage } from '../typescript/action';

type AdditionalParam = {
  article_title: string;
}

export type ArticleProps = {
  article_title: string;
  article_description?: string;
  article_image?: ContentstackImage;
  $: {
    article_title: string;
    article_description?: string;
    article_image?: any;
  };
};

export default function FromSection({ section }: { section: ArticleProps }) {
  // This helper function builds the HTML
  function contentSection() {
    return (
      <div className='home-content'>
        {section.article_image?.url && (
          <div className="article-image-wrapper" {...(section.$?.article_image as {})}>
            <NextImage 
              src={section.article_image.url} 
              alt={section.article_image.title || "Article Image"} 
              width={800} // Set appropriate dimensions
              height={450}
              className="rounded-lg"
            />
          </div>
        )}
        {section.article_title && (
          <h2 {...(section.$?.article_title as {})}>{section.article_title}</h2>
        )}
        {/* Note: You might want a different field for the description later */}
        {section.article_description && (
          <p {...(section.$?.article_description as {})}>{section.article_description}</p>
        )}
      </div>
    );
  }

  // YOU NEED THIS RETURN TO SHOW IT ON SCREEN
  return (
    <div className="from-section-container">
       {contentSection()}
    </div>
  );
}