import React from "react";

type AdditionalParam = {
  blogbannerdescription: string;
  banner_description: string;
  title: {};
  date: string;
};

type BannerProps = {
  blogbannerdescription: string;
  banner_description: string;

  $: AdditionalParam;
};

export default function BlogBanner({
  blogBanner1,
}: {
  blogBanner1: BannerProps;
}) {
  return (
    <div
      className="blog-page-banner"
      style={{
        background:"red",
      }}
    >
      <div className="blog-page-content">
        {blogBanner1.blogbannerdescription && (
          <h1 className="hero-title" {...(blogBanner1.$?.blogbannerdescription as {})}>
            {blogBanner1.blogbannerdescription}
          </h1>
        )}

        {blogBanner1.blogbannerdescription && (
          <p
            className="hero-description"
            {...(blogBanner1.$?.blogbannerdescription as {})}
          >
            {blogBanner1.blogbannerdescription}
          </p>
        )}
      </div>
    </div>
  );
}
