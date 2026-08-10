import {
  PREVIEW_BELONGINGS,
  PREVIEW_HIGHLIGHTS,
  PREVIEW_SCHEDULE,
} from "@/data/previewSampleContent";

const PREVIEW_LIMIT = 3;

export default function FacilityHighlightCards() {
  const cards = [
    PREVIEW_BELONGINGS.length > 0 && (
      <article className="facility-detail__highlight-card" key="belongings">
        <h3><span aria-hidden="true">🎒</span>持ち物リスト</h3>
        <ul className="facility-detail__belongings">
          {PREVIEW_BELONGINGS.slice(0, PREVIEW_LIMIT).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        {PREVIEW_BELONGINGS.length > PREVIEW_LIMIT && (
          <details className="facility-detail__highlight-more">
            <summary>すべて見る</summary>
            <ul className="facility-detail__belongings">
              {PREVIEW_BELONGINGS.slice(PREVIEW_LIMIT).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        )}
      </article>
    ),
    PREVIEW_SCHEDULE.length > 0 && (
      <article className="facility-detail__highlight-card" key="schedule">
        <h3><span aria-hidden="true">🕐</span>滞在中のスケジュール例<small>（1日の場合）</small></h3>
        <ol className="facility-detail__schedule">
          {PREVIEW_SCHEDULE.slice(0, PREVIEW_LIMIT).map((item) => (
            <li key={item.time}><time>{item.time}</time><span>{item.content}</span></li>
          ))}
        </ol>
        {PREVIEW_SCHEDULE.length > PREVIEW_LIMIT && (
          <details className="facility-detail__highlight-more">
            <summary>すべて見る</summary>
            <ol className="facility-detail__schedule">
              {PREVIEW_SCHEDULE.slice(PREVIEW_LIMIT).map((item) => (
                <li key={item.time}><time>{item.time}</time><span>{item.content}</span></li>
              ))}
            </ol>
          </details>
        )}
      </article>
    ),
    PREVIEW_HIGHLIGHTS.length > 0 && (
      <article className="facility-detail__highlight-card" key="highlights">
        <h3><span aria-hidden="true">💬</span>施設の推しポイント</h3>
        <div className="facility-detail__voices">
          {PREVIEW_HIGHLIGHTS.slice(0, 1).map((item) => (
            <div className="facility-detail__voice" key={item.category}>
              <span>{item.category}</span><strong>{item.name}</strong><p>{item.body}</p>
            </div>
          ))}
        </div>
        {PREVIEW_HIGHLIGHTS.length > 1 && (
          <details className="facility-detail__highlight-more">
            <summary>すべて見る</summary>
            <div className="facility-detail__voices">
              {PREVIEW_HIGHLIGHTS.slice(1).map((item) => (
                <div className="facility-detail__voice" key={item.category}>
                  <span>{item.category}</span><strong>{item.name}</strong><p>{item.body}</p>
                </div>
              ))}
            </div>
          </details>
        )}
      </article>
    ),
  ].filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <section className="facility-detail__section facility-detail__highlights">
      <div className="facility-detail__highlight-grid">{cards}</div>
    </section>
  );
}
