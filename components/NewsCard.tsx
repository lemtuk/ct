type NewsCardProps = {
  source: string;
  date: string;
  headline: string;
};

export default function NewsCard({ source, date, headline }: NewsCardProps) {
  return (
    <article className="bc-news-card">
      <p className="bc-news-card__meta">
        {source} <span aria-hidden>·</span> {date}
      </p>
      <h3 className="bc-news-card__headline">{headline}</h3>
      <a href="#top" className="bc-news-card__link">
        Read Article
        <span className="bc-news-card__link-icon" aria-hidden>↗</span>
      </a>
    </article>
  );
}
